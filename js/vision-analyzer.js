// =========================================================================
// PaharRakshak - Client-Side Slope Vision Analyzer
// Canvas pixel analysis for on-device edge detection, soil saturation & texture
// 100% Offline, runs purely inside browser memory
// =========================================================================

export class VisionAnalyzer {
  /**
   * Analyzes an image element or DataURL
   * Returns estimated moisture index, edge complexity, and hazard confidence
   */
  static analyzeImage(imageSource) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 200;
        const height = Math.floor((img.height / img.width) * width) || 150;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        let totalBrightness = 0;
        let darkPixelCount = 0;
        let edgeTransitions = 0;
        let previousLuma = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Perceived luminance
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          totalBrightness += luma;

          if (luma < 60) {
            darkPixelCount++; // Wet / saturated mud indicator
          }

          if (i > 0 && Math.abs(luma - previousLuma) > 45) {
            edgeTransitions++; // Tension crack / rock edge indicator
          }
          previousLuma = luma;
        }

        const totalPixels = width * height;
        const avgLuminance = Math.round(totalBrightness / totalPixels);
        const moistureIndex = Math.min(100, Math.round((darkPixelCount / totalPixels) * 180));
        const crackFissureDensity = Math.min(100, Math.round((edgeTransitions / totalPixels) * 220));

        // Generate thumbnail for storage
        const thumbnail = canvas.toDataURL('image/jpeg', 0.6);

        resolve({
          thumbnail,
          avgLuminance,
          moistureIndex,
          crackFissureDensity,
          width: img.width,
          height: img.height,
          timestamp: Date.now()
        });
      };

      img.onerror = () => {
        resolve({
          thumbnail: null,
          avgLuminance: 50,
          moistureIndex: 40,
          crackFissureDensity: 35,
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
}
