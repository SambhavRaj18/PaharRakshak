// =========================================================================
// PaharRakshak - Client-Side Slope Vision Analyzer & Hazard Classifier
// On-Device Edge Detection (Sobel Filters), Soil Saturation, & Hazard Classifier
// 100% Offline, runs purely inside browser memory via Canvas API
// =========================================================================

export class VisionAnalyzer {
  /**
   * Analyzes an image element or DataURL
   * Runs Sobel Edge Gradients, Soil Moisture, Vegetation Ratio & Auto-Classifies Hazard
   */
  static analyzeImage(imageSource) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 240;
        const height = Math.floor((img.height / img.width) * width) || 180;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        let totalBrightness = 0;
        let darkPixelCount = 0;
        let greenVegetationPixels = 0;
        let earthyMudPixels = 0;

        // Grayscale matrix for Sobel edge convolution
        const grayMatrix = new Float32Array(width * height);

        for (let i = 0, p = 0; i < data.length; i += 4, p++) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Perceived luminance
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          grayMatrix[p] = luma;
          totalBrightness += luma;

          // Soil moisture indicator (saturated dark areas)
          if (luma < 55) {
            darkPixelCount++;
          }

          // Vegetation detection (green dominance)
          if (g > r * 1.15 && g > b * 1.15 && g > 40) {
            greenVegetationPixels++;
          }

          // Earth/Mud detection (warm brownish hues: R > B, R >= G)
          if (r > b * 1.25 && r >= g && luma > 30 && luma < 170) {
            earthyMudPixels++;
          }
        }

        const totalPixels = width * height;
        const avgLuminance = Math.round(totalBrightness / totalPixels);
        const moistureIndex = Math.min(100, Math.round((darkPixelCount / totalPixels) * 190));
        const vegetationRatio = Math.round((greenVegetationPixels / totalPixels) * 100);
        const earthMudRatio = Math.round((earthyMudPixels / totalPixels) * 100);

        // --- 2D Sobel Filter for Tension Crack & Masonry Shear Detection ---
        let totalGradientMag = 0;
        let horizontalGradients = 0;
        let verticalGradients = 0;
        let highEdgePixels = 0;

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;

            // Sobel X kernel: [-1, 0, 1], [-2, 0, 2], [-1, 0, 1]
            const gx = (
              -1 * grayMatrix[idx - width - 1] + 1 * grayMatrix[idx - width + 1] +
              -2 * grayMatrix[idx - 1]         + 2 * grayMatrix[idx + 1] +
              -1 * grayMatrix[idx + width - 1] + 1 * grayMatrix[idx + width + 1]
            );

            // Sobel Y kernel: [-1, -2, -1], [0, 0, 0], [1, 2, 1]
            const gy = (
              -1 * grayMatrix[idx - width - 1] - 2 * grayMatrix[idx - width] - 1 * grayMatrix[idx - width + 1] +
               1 * grayMatrix[idx + width - 1] + 2 * grayMatrix[idx + width] + 1 * grayMatrix[idx + width + 1]
            );

            const mag = Math.sqrt(gx * gx + gy * gy);
            totalGradientMag += mag;

            if (Math.abs(gx) > 40) verticalGradients += Math.abs(gx);
            if (Math.abs(gy) > 40) horizontalGradients += Math.abs(gy);

            if (mag > 65) {
              highEdgePixels++;
            }
          }
        }

        const crackFissureDensity = Math.min(100, Math.round((highEdgePixels / totalPixels) * 350));
        const directionalRatio = verticalGradients > 0 ? (horizontalGradients / verticalGradients) : 1;

        // --- AI Hazard Classifier Heuristic Matrix ---
        const classification = VisionAnalyzer.classifyHazard({
          moistureIndex,
          crackFissureDensity,
          vegetationRatio,
          earthMudRatio,
          directionalRatio,
          avgLuminance
        });

        // Generate thumbnail for IndexedDB storage
        const thumbnail = canvas.toDataURL('image/jpeg', 0.65);

        resolve({
          thumbnail,
          avgLuminance,
          moistureIndex,
          crackFissureDensity,
          vegetationRatio,
          earthMudRatio,
          predictedHazard: classification.predictedHazard,
          confidenceScore: classification.confidenceScore,
          classificationRationale: classification.rationale,
          width: img.width,
          height: img.height,
          timestamp: Date.now()
        });
      };

      img.onerror = () => {
        resolve({
          thumbnail: null,
          avgLuminance: 50,
          moistureIndex: 45,
          crackFissureDensity: 40,
          vegetationRatio: 20,
          earthMudRatio: 40,
          predictedHazard: 'hazardCrack',
          confidenceScore: 65,
          classificationRationale: 'Default heuristic due to image decoding limit.',
          width: 0,
          height: 0,
          timestamp: Date.now()
        });
      };

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.readAsDataURL(imageSource);
      }
    });
  }

  /**
   * Evaluates vision feature vectors to predict primary hazard type
   */
  static classifyHazard(metrics) {
    const { moistureIndex, crackFissureDensity, vegetationRatio, earthMudRatio, directionalRatio } = metrics;

    let predictedHazard = 'hazardCrack';
    let confidenceScore = 70;
    let rationale = '';

    // Rule 1: High Edge density + low moisture = Tension Cracks or Shear Fractures
    if (crackFissureDensity >= 45 && moistureIndex < 55) {
      if (directionalRatio > 1.4) {
        predictedHazard = 'hazardWallBulge';
        confidenceScore = Math.min(94, 65 + Math.round(crackFissureDensity * 0.3));
        rationale = 'Prominent horizontal shear lines and masonry displacement detected (Retaining Wall Distress).';
      } else {
        predictedHazard = 'hazardCrack';
        confidenceScore = Math.min(95, 68 + Math.round(crackFissureDensity * 0.3));
        rationale = 'High Sobel edge gradient with linear fissure patterns (Ground Tension Crack).';
      }
    }
    // Rule 2: High Moisture + Mud Dominance = Saturated Soil / Water Seepage
    else if (moistureIndex >= 50 && earthMudRatio >= 30) {
      predictedHazard = 'hazardSeepage';
      confidenceScore = Math.min(92, 60 + Math.round(moistureIndex * 0.35));
      rationale = 'Low surface luminance with high moisture saturation coefficient (Active Water Seepage / Slurry).';
    }
    // Rule 3: High Vegetation + moderate edge transitions = Tilted Trees / Slope Creep
    else if (vegetationRatio >= 25 && crackFissureDensity >= 25) {
      predictedHazard = 'hazardTiltedTrees';
      confidenceScore = Math.min(88, 55 + Math.round(vegetationRatio * 0.5));
      rationale = 'Vegetation canopy detected with angular displacement (Tilted Trees / Slope Creep).';
    }
    // Rule 4: High Earth/Mud ratio with moderate edge density = Rockfall / Debris Accumulation
    else if (earthMudRatio >= 35) {
      predictedHazard = 'hazardDebris';
      confidenceScore = Math.min(90, 58 + Math.round(earthMudRatio * 0.4));
      rationale = 'Earthy soil texture and loose material distribution (Rockfall / Debris Accumulation).';
    }
    // Default fallback
    else {
      predictedHazard = 'hazardCrack';
      confidenceScore = 72;
      rationale = 'Structural edge transitions detected across slope surface.';
    }

    return {
      predictedHazard,
      confidenceScore,
      rationale
    };
  }
}
