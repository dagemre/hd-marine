import fs from "node:fs";
import path from "node:path";
import { HeroSlider } from "./hero-slider";

/**
 * Hero slider görselleri — sıra Emre'nin tasarımına göre:
 * 1) hero3.png  2) hero2.jpg  3) hero.jpg
 * Dosya public'te yoksa sessizce listeden düşer (kod değişikliği gerekmez).
 */
const SLIDE_FILES = ["hero3.png", "hero2.jpg", "hero.jpg"];

export function Hero() {
  let images: string[] = [];
  try {
    images = SLIDE_FILES.filter((f) =>
      fs.existsSync(path.join(process.cwd(), "public", f))
    ).map((f) => `/${f}`);
  } catch {
    images = [];
  }

  return <HeroSlider images={images} />;
}
