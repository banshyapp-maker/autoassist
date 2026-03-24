# AutoAssist - Sistema de Gestión para Talleres Mecánicos

CRM completo con IA para talleres automotrices en Panamá y Latinoamérica.

## 🚀 Características

- ✅ Gestión de clientes y vehículos
- ✅ Historial completo de servicios
- ✅ Cotizaciones generadas con IA (Claude)
- ✅ Recordatorios automáticos de mantenimiento
- ✅ Dashboard con métricas del negocio
- ✅ Autenticación segura (Clerk)
- ✅ Base de datos escalable (Supabase)

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en Clerk
- Cuenta en Anthropic (Claude API)
- Cuenta en Resend

## 🔧 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Luego edita `.env` y agrega tus credenciales:

```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Anthropic (Claude API)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# Resend
VITE_RESEND_API_KEY=re_...
```

### 3. Configurar base de datos en Supabase

1. Ve a tu proyecto de Supabase
2. Abre el SQL Editor
3. Ejecuta el archivo `supabase-setup.sql` (crear las tablas)

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🌐 Despliegue en Vercel

### Opción 1: Desde GitHub

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Click en "Import Project"
4. Selecciona tu repositorio
5. Agrega las variables de entorno en Settings
6. Deploy!

### Opción 2: CLI de Vercel

```bash
npm i -g vercel
vercel login
vercel
```

## 📊 Estructura del Proyecto

```
autoassist/
├── src/
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   ├── index.css            # Estilos globales
│   └── lib/
│       ├── supabase.ts      # Cliente de Supabase
│       └── types.ts         # Tipos TypeScript
├── public/                  # Archivos estáticos
├── .env.example             # Template de variables
├── package.json             # Dependencias
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind
└── README.md               # Este archivo
```

## 💰 Costos Estimados

- **Supabase**: GRATIS (hasta 500MB DB)
- **Clerk**: GRATIS (hasta 10,000 usuarios)
- **Anthropic API**: ~$5-20/mes (pay-per-use)
- **Resend**: GRATIS (3,000 emails/mes)
- **Vercel**: GRATIS (plan Hobby)

**Total inicial: ~$5-20/mes**

## 📈 Roadmap

### Fase 1 (Actual) - MVP
- [x] Autenticación de usuarios
- [x] Base de datos configurada
- [ ] CRUD de clientes y vehículos
- [ ] Registro de servicios
- [ ] Dashboard básico

### Fase 2 - IA y Automatización
- [ ] Generación de cotizaciones con Claude
- [ ] Recordatorios automáticos por email
- [ ] Integración con WhatsApp

### Fase 3 - Pagos y Suscripciones
- [ ] Integración con Stripe
- [ ] Planes de suscripción
- [ ] Facturación automática

### Fase 4 - Características Avanzadas
- [ ] App móvil
- [ ] Reportes PDF
- [ ] Inventario de repuestos
- [ ] Multi-taller

## 🤝 Soporte

Para dudas o problemas:
- Email: soporte@autoassist.com
- Documentación: [docs.autoassist.com](https://docs.autoassist.com)

## 📝 Licencia

Privado - Todos los derechos reservados

---

Desarrollado con ❤️ para talleres mecánicos en Panamá
