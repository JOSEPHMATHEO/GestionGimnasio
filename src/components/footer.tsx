import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[#333333] text-white py-6 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Sección de Copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2024 UTPL | GYM ACTIVE</p>
          </div>

          {/* Sección de Enlaces (una fila) */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-4">
            <a href="#" className="text-sm hover:underline">Acerca de Nosotros</a>
            <a href="#" className="text-sm hover:underline">Políticas de Privacidad</a>
            <a href="#" className="text-sm hover:underline">Contáctanos</a>
            <a href="#" className="text-sm hover:underline">Ayuda</a>
            <a href="#" className="text-sm hover:underline">Dirección</a>
          </div>

          {/* Sección de Información de Contacto */}
          <div className="text-sm mt-4 md:mt-0 text-center md:text-left">
            <p>Wisconsin Ave, Suite 700 Chevy Chase, Maryland 20815</p>
            <p>support@figma.com</p>
            <p>+1 800 854-36-80</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
