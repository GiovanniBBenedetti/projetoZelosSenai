'use client';

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import Footer from './Footer';

export default function FooterLayout() {
  const [funcao, setFuncao] = useState('');

  useEffect(() => {
    const funcaoCookie = getCookie('funcao');
    if (funcaoCookie) {
      setFuncao(funcaoCookie.toLowerCase());
    }
  }, []);

  return <Footer funcao={funcao} />;
}