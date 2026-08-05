/* eslint-disable @next/next/no-img-element -- Arquivos locais já otimizados evitam depender do transformador de imagens da hospedagem. */
import type { ImgHTMLAttributes } from "react";

export interface SiteImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> {
  alt: string;
  src: string;
  fill?: boolean;
  priority?: boolean;
}

/**
 * Imagem para arquivos locais já preparados para a web. Evita depender de um
 * serviço externo de transformação e mantém o preview igual à publicação.
 */
export function SiteImage({
  alt,
  className = "",
  fill = false,
  loading,
  priority = false,
  src,
  ...props
}: SiteImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      className={[fill ? "absolute inset-0 size-full" : "", className]
        .filter(Boolean)
        .join(" ")}
      decoding="async"
      fetchPriority={priority ? "high" : props.fetchPriority}
      loading={priority ? "eager" : (loading ?? "lazy")}
      src={src}
    />
  );
}

export default SiteImage;
