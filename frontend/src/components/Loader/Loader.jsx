"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Image
        src="/logotipos/loaderGif.gif"
        alt="Carregando..."
        width={220}
        height={130}
        className="loader-img"
        priority
      />
    </div>
  );
}