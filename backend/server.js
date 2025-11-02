const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambialo-en-produccion';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// ==================== BASE DE DATOS EN MEMORIA ====================
let usuarios = [
  {
    id: 1,
    email: 'admin@lms.com',
    password: '$2a$10$8K1p/a0dL3.fakehash.admin123', // admin123 hasheado
    nombre: 'Admin',
    apellido: 'Sistema',
    rol: 'ADMIN',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    email: 'docente@lms.com',
    password: '$2a$10$8K1p/a0dL3.fakehash.admin123', // admin123 hasheado
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'DOCENTE',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    email: 'estudiante@lms.com',
    password: '$2a$10$8K1p/a0dL3.fakehash.admin123', // admin123 hasheado
    nombre: 'María',
    apellido: 'García',
    rol: 'ESTUDIANTE',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let cursos = [
  {
    id: 1,
    titulo: 'Introducción a la Programación',
    descripcion: 'Curso básico de programación para principiantes',
    codigo: 'PROG-101',
    activo: true,
    creadorId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    titulo: 'Base de Datos',
    descripcion: 'Diseño e implementación de bases de datos relacionales',
    codigo: 'BD-201',
    activo: true,
    creadorId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    titulo: 'Desarrollo Web',
    descripcion: 'Creación de aplicaciones web modernas',
    codigo: 'WEB-301',
    activo: false,
    creadorId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let clases = [
  {
    id: 1,
    titulo: 'Variables y Tipos de Datos',
    descripcion: 'Aprende sobre variables y tipos de datos básicos',
    fecha: new Date('2024-01-15'),
    duracion: 60,
    cursoId: 1,
    orden: 1,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    titulo: 'Estructuras de Control',
    descripcion: 'If, else, switch y bucles',
    fecha: new Date('2024-01-20'),
    duracion: 90,
    cursoId: 1,
    orden: 2,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let tareas = [
  {
    id: 1,
    titulo: 'Ejercicio de Variables y Tipos de Datos',
    descripcion: 'Crear un programa que demuestre el uso de diferentes tipos de variables en JavaScript. Incluye ejemplos de variables numéricas, strings, booleanos, arrays y objetos.',
    fechaLimite: new Date('2024-02-20'),
    puntaje: 100,
    cursoId: 1,
    claseId: 1,
    activa: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    titulo: 'Proyecto Final - Sistema de Gestión',
    descripcion: 'Diseñar e implementar una base de datos completa para un sistema de gestión de biblioteca con operaciones CRUD',
    fechaLimite: new Date('2024-02-15'),
    puntaje: 200,
    cursoId: 1,
    claseId: null,
    activa: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 3,
    titulo: 'Diseño de Base de Datos',
    descripcion: 'Diseñar el esquema de base de datos para un sistema de biblioteca incluyendo diagrama ER y normalización',
    fechaLimite: new Date('2024-03-10'),
    puntaje: 150,
    cursoId: 2,
    claseId: null,
    activa: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 4,
    titulo: 'Consultas SQL Avanzadas',
    descripcion: 'Realizar consultas complejas usando JOIN, subconsultas, funciones agregadas y vistas',
    fechaLimite: new Date('2024-03-25'),
    puntaje: 120,
    cursoId: 2,
    claseId: null,
    activa: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 5,
    titulo: 'Sitio Web Responsivo con Bootstrap',
    descripcion: 'Crear un sitio web profesional que se adapte a diferentes dispositivos usando Bootstrap 5',
    fechaLimite: new Date('2024-01-30'),
    puntaje: 150,
    cursoId: 3,
    claseId: null,
    activa: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

let matriculas = [
  {
    id: 1,
    estudianteId: 3,
    cursoId: 1,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    estudianteId: 3,
    cursoId: 2,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let entregas = [
  {
    id: 1,
    archivoUrl: 'uploads/entrega1.pdf',
    comentario: 'Mi primera entrega',
    calificacion: 92,
    estado: 'CALIFICADA',
    tareaId: 1,
    estudianteId: 3,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 2,
    archivoUrl: 'uploads/entrega2.pdf',
    comentario: 'Entrega del proyecto final',
    calificacion: null,
    estado: 'ENTREGADA',
    tareaId: 2,
    estudianteId: 3,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 3,
    archivoUrl: 'uploads/entrega3.docx',
    comentario: 'Ejercicio de variables completado',
    calificacion: 85,
    estado: 'CALIFICADA',
    tareaId: 1,
    estudianteId: 3,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 4,
    archivoUrl: 'uploads/entrega_bd_1.pdf',
    comentario: 'Diseño de base de datos completado',
    calificacion: 135,
    estado: 'CALIFICADA',
    tareaId: 3,
    estudianteId: 3,
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-09')
  },
  {
    id: 5,
    archivoUrl: 'uploads/entrega_sql_1.sql',
    comentario: 'Consultas SQL realizadas',
    calificacion: null,
    estado: 'ENTREGADA',
    tareaId: 4,
    estudianteId: 3,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  }
];

let materiales = [
  {
    id: 1,
    titulo: 'Presentación Variables',
    descripcion: 'Slides sobre variables y tipos de datos',
    archivoUrl: 'materiales/variables.pdf',
    tipo: 'PDF',
    tamano: 1024000,
    claseId: 1,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let mensajes = [
  {
    id: 1,
    contenido: '¿Cuándo es la próxima clase?',
    cursoId: 1,
    usuarioId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    contenido: 'La próxima clase es el lunes a las 10am',
    cursoId: 1,
    usuarioId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let tokensRevocados = [];

// Contadores para IDs autoincrementales
let contadores = {
  usuarios: 4,
  cursos: 4,
  clases: 3,
  tareas: 6,
  matriculas: 3,
  entregas: 6,
  materiales: 2,
  mensajes: 3,
  tokensRevocados: 1
};

// ==================== MIDDLEWARE DE AUTENTICACIÓN ====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  // Verificar si el token está revocado
  if (tokensRevocados.find(t => t.token === token)) {
    return res.status(401).json({ message: 'Token revocado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar rol
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
};

// ==================== RUTAS DE AUTENTICACIÓN ====================
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const user = usuarios.find(u => u.email === email && u.activo);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // MODO DEMO: Aceptar tanto "password" como "admin123"
    const passwordsValidas = ['password', 'admin123'];
    const validPassword = passwordsValidas.includes(password) || 
                         await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      access_token: token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { email, password, nombre, apellido, rol } = req.body;

    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (usuarios.find(u => u.email === email)) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: contadores.usuarios++,
      email,
      password: hashedPassword,
      nombre,
      apellido,
      rol: rol || 'ESTUDIANTE',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    usuarios.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ 
      message: 'Usuario creado exitosamente', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/v1/auth/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    tokensRevocados.push({
      id: contadores.tokensRevocados++,
      token,
      usuarioId: req.user.id,
      expiraEn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date()
    });
  }
  
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// ==================== RUTAS DE USUARIO ====================
app.get('/api/v1/users/me', authenticateToken, (req, res) => {
  const user = usuarios.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.patch('/api/v1/users/me', authenticateToken, (req, res) => {
  const { nombre, apellido, email } = req.body;
  const user = usuarios.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  if (email && email !== user.email) {
    if (usuarios.find(u => u.email === email && u.id !== user.id)) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }
  }

  if (nombre) user.nombre = nombre;
  if (apellido) user.apellido = apellido;
  if (email) user.email = email;
  user.updatedAt = new Date();

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.patch('/api/v1/users/me/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = usuarios.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = new Date();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ==================== RUTAS DE CURSOS ====================
app.get('/api/v1/cursos', authenticateToken, (req, res) => {
  const { page = 1, limit = 10, activo } = req.query;
  
  let cursosFiltrados = [...cursos];
  
  if (activo !== undefined) {
    cursosFiltrados = cursosFiltrados.filter(c => c.activo === (activo === 'true'));
  }

  // Agregar información adicional
  const cursosConInfo = cursosFiltrados.map(curso => {
    const creador = usuarios.find(u => u.id === curso.creadorId);
    const clasesCount = clases.filter(cl => cl.cursoId === curso.id).length;
    const matriculasCount = matriculas.filter(m => m.cursoId === curso.id && m.activa).length;
    
    return {
      ...curso,
      creador: creador ? { nombre: creador.nombre, apellido: creador.apellido } : null,
      _count: {
        clases: clasesCount,
        matriculas: matriculasCount
      }
    };
  });

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginados = cursosConInfo.slice(start, end);

  res.json({
    data: paginados,
    meta: {
      total: cursosConInfo.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(cursosConInfo.length / limit)
    }
  });
});

app.get('/api/v1/cursos/:id', authenticateToken, (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  const creador = usuarios.find(u => u.id === curso.creadorId);
  const clasesCount = clases.filter(cl => cl.cursoId === curso.id).length;
  const matriculasCount = matriculas.filter(m => m.cursoId === curso.id && m.activa).length;
  const mensajesCount = mensajes.filter(m => m.cursoId === curso.id).length;

  res.json({
    ...curso,
    creador: creador ? { nombre: creador.nombre, apellido: creador.apellido } : null,
    _count: {
      clases: clasesCount,
      matriculas: matriculasCount,
      mensajes: mensajesCount
    }
  });
});

app.post('/api/v1/cursos', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { titulo, descripcion, codigo } = req.body;

  if (!titulo || !codigo) {
    return res.status(400).json({ message: 'Título y código son requeridos' });
  }

  if (cursos.find(c => c.codigo === codigo)) {
    return res.status(400).json({ message: 'El código del curso ya existe' });
  }

  const nuevoCurso = {
    id: contadores.cursos++,
    titulo,
    descripcion: descripcion || null,
    codigo,
    activo: true,
    creadorId: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  cursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

app.patch('/api/v1/cursos/:id', authenticateToken, requireRole('ADMIN', 'DOCENTE'), (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  if (req.user.rol !== 'ADMIN' && curso.creadorId !== req.user.id) {
    return res.status(403).json({ message: 'No tienes permiso para editar este curso' });
  }

  const { titulo, descripcion, codigo, activo } = req.body;

  if (titulo) curso.titulo = titulo;
  if (descripcion !== undefined) curso.descripcion = descripcion;
  if (codigo && codigo !== curso.codigo) {
    if (cursos.find(c => c.codigo === codigo && c.id !== curso.id)) {
      return res.status(400).json({ message: 'El código ya está en uso' });
    }
    curso.codigo = codigo;
  }
  if (activo !== undefined) curso.activo = activo;
  curso.updatedAt = new Date();

  res.json(curso);
});

app.delete('/api/v1/cursos/:id', authenticateToken, requireRole('ADMIN', 'DOCENTE'), (req, res) => {
  const index = cursos.findIndex(c => c.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  const curso = cursos[index];
  if (req.user.rol !== 'ADMIN' && curso.creadorId !== req.user.id) {
    return res.status(403).json({ message: 'No tienes permiso para eliminar este curso' });
  }

  cursos.splice(index, 1);
  res.status(204).send();
});

// ==================== RUTAS DE CLASES ====================
app.get('/api/v1/cursos/:id/clases', authenticateToken, (req, res) => {
  const cursoId = parseInt(req.params.id);
  const clasesDelCurso = clases.filter(cl => cl.cursoId === cursoId);
  
  const clasesConMateriales = clasesDelCurso.map(clase => {
    const materialesCount = materiales.filter(m => m.claseId === clase.id).length;
    const tareasCount = tareas.filter(t => t.claseId === clase.id).length;
    
    return {
      ...clase,
      _count: {
        materiales: materialesCount,
        tareas: tareasCount
      }
    };
  });

  res.json(clasesConMateriales);
});

app.get('/api/v1/clases/:id', authenticateToken, (req, res) => {
  const clase = clases.find(cl => cl.id === parseInt(req.params.id));
  
  if (!clase) {
    return res.status(404).json({ message: 'Clase no encontrada' });
  }

  const curso = cursos.find(c => c.id === clase.cursoId);
  const materialesClase = materiales.filter(m => m.claseId === clase.id);
  const tareasClase = tareas.filter(t => t.claseId === clase.id);

  res.json({
    ...clase,
    curso: curso ? { id: curso.id, titulo: curso.titulo } : null,
    materiales: materialesClase,
    tareas: tareasClase
  });
});

app.post('/api/v1/clases', authenticateToken, requireRole('ADMIN', 'DOCENTE'), (req, res) => {
  const { titulo, descripcion, fecha, duracion, cursoId, orden } = req.body;

  if (!titulo || !fecha || !cursoId) {
    return res.status(400).json({ message: 'Título, fecha y curso son requeridos' });
  }

  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  const nuevaClase = {
    id: contadores.clases++,
    titulo,
    descripcion: descripcion || null,
    fecha: new Date(fecha),
    duracion: duracion || null,
    cursoId,
    orden: orden || 0,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  clases.push(nuevaClase);
  res.status(201).json(nuevaClase);
});

// ==================== RUTAS DE TAREAS ====================
app.get('/api/v1/tareas', authenticateToken, (req, res) => {
  const { cursoId, page = 1, limit = 10 } = req.query;
  
  let tareasFiltradas = [...tareas];
  
  if (cursoId) {
    tareasFiltradas = tareasFiltradas.filter(t => t.cursoId === parseInt(cursoId));
  }

  // Para estudiantes, agregar información de sus entregas
  const tareasConInfo = tareasFiltradas.map(tarea => {
    const curso = cursos.find(c => c.id === tarea.cursoId);
    const entregasCount = entregas.filter(e => e.tareaId === tarea.id).length;
    let miEntrega = null;

    if (req.user.rol === 'ESTUDIANTE') {
      miEntrega = entregas.find(e => e.tareaId === tarea.id && e.estudianteId === req.user.id);
    }

    return {
      ...tarea,
      curso: curso ? { id: curso.id, titulo: curso.titulo } : null,
      _count: { entregas: entregasCount },
      entrega: miEntrega || null,
      estado: miEntrega ? miEntrega.estado : 'PENDIENTE'
    };
  });

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginados = tareasConInfo.slice(start, end);

  res.json({
    data: paginados,
    meta: {
      total: tareasConInfo.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(tareasConInfo.length / limit)
    }
  });
});

app.get('/api/v1/tareas/:id', authenticateToken, (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  
  if (!tarea) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  const curso = cursos.find(c => c.id === tarea.cursoId);
  const entregasTarea = entregas.filter(e => e.tareaId === tarea.id).map(entrega => {
    const estudiante = usuarios.find(u => u.id === entrega.estudianteId);
    return {
      ...entrega,
      estudiante: estudiante ? { 
        id: estudiante.id, 
        nombre: estudiante.nombre, 
        apellido: estudiante.apellido,
        email: estudiante.email 
      } : null
    };
  });

  // Determinar estado de la tarea para el estudiante actual
  let estado = 'PENDIENTE';
  let miEntrega = null;
  
  if (req.user.rol === 'ESTUDIANTE') {
    miEntrega = entregas.find(e => e.tareaId === tarea.id && e.estudianteId === req.user.id);
    if (miEntrega) {
      estado = miEntrega.estado;
    }
  }

  res.json({
    ...tarea,
    estado: estado,
    curso: curso ? { id: curso.id, titulo: curso.titulo } : null,
    entregas: entregasTarea,
    _count: {
      entregas: entregasTarea.length
    }
  });
});

app.post('/api/v1/tareas', authenticateToken, requireRole('DOCENTE'), (req, res) => {
  const { titulo, descripcion, fechaLimite, puntaje, cursoId, claseId } = req.body;

  if (!titulo || !fechaLimite || !puntaje || !cursoId) {
    return res.status(400).json({ message: 'Título, fecha límite, puntaje y curso son requeridos' });
  }

  const nuevaTarea = {
    id: contadores.tareas++,
    titulo,
    descripcion: descripcion || null,
    fechaLimite: new Date(fechaLimite),
    puntaje,
    cursoId,
    claseId: claseId || null,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// ==================== RUTAS DE ENTREGAS ====================
app.post('/api/v1/entregas', authenticateToken, requireRole('ESTUDIANTE'), (req, res) => {
  const { tareaId, comentario, archivoUrl } = req.body;

  if (!tareaId) {
    return res.status(400).json({ message: 'ID de tarea es requerido' });
  }

  const tarea = tareas.find(t => t.id === tareaId);
  if (!tarea) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  // Verificar si ya existe una entrega
  const entregaExistente = entregas.find(
    e => e.tareaId === tareaId && e.estudianteId === req.user.id
  );

  if (entregaExistente) {
    return res.status(400).json({ message: 'Ya existe una entrega para esta tarea' });
  }

  const nuevaEntrega = {
    id: contadores.entregas++,
    archivoUrl: archivoUrl || null,
    comentario: comentario || null,
    calificacion: null,
    estado: 'ENTREGADA',
    tareaId,
    estudianteId: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  entregas.push(nuevaEntrega);
  res.status(201).json(nuevaEntrega);
});

app.patch('/api/v1/entregas/:id', authenticateToken, (req, res) => {
  const entrega = entregas.find(e => e.id === parseInt(req.params.id));
  
  if (!entrega) {
    return res.status(404).json({ message: 'Entrega no encontrada' });
  }

  // Estudiantes solo pueden actualizar sus propias entregas
  if (req.user.rol === 'ESTUDIANTE' && entrega.estudianteId !== req.user.id) {
    return res.status(403).json({ message: 'No tienes permiso para editar esta entrega' });
  }

  const { comentario, archivoUrl, calificacion } = req.body;

  if (req.user.rol === 'ESTUDIANTE') {
    if (comentario !== undefined) entrega.comentario = comentario;
    if (archivoUrl !== undefined) entrega.archivoUrl = archivoUrl;
  }

  if (req.user.rol === 'DOCENTE' || req.user.rol === 'ADMIN') {
    if (calificacion !== undefined) {
      entrega.calificacion = calificacion;
      entrega.estado = 'CALIFICADA';
    }
  }

  entrega.updatedAt = new Date();
  res.json(entrega);
});

// Obtener todas las entregas de un curso específico (para docentes)
app.get('/api/v1/cursos/:cursoId/entregas', authenticateToken, (req, res) => {
  try {
    const cursoId = parseInt(req.params.cursoId);
    
    // Verificar que el cursoId sea válido
    if (isNaN(cursoId)) {
      return res.status(400).json({ message: 'ID de curso inválido' });
    }
    
    // Verificar que el curso existe
    const curso = cursos.find(c => c.id === cursoId);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    
    // Verificar permisos: solo docentes y admins pueden ver entregas de cursos
    // Si es docente, verificar que es el creador del curso o tiene acceso
    if (req.user.rol === 'ESTUDIANTE') {
      return res.status(403).json({ message: 'No tienes permisos para ver entregas de este curso' });
    }
    
    // Si es docente y no es admin, verificar que es el creador del curso
    if (req.user.rol === 'DOCENTE' && curso.creadorId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permisos para ver entregas de este curso' });
    }
    
    // Obtener todas las tareas del curso
    const tareasDelCurso = tareas.filter(t => t.cursoId === cursoId && t.activa);
    const tareasIds = tareasDelCurso.map(t => t.id);
    
    // Obtener todas las entregas de esas tareas
    const entregasDelCurso = entregas
      .filter(e => tareasIds.includes(e.tareaId))
      .map(entrega => {
        const tarea = tareas.find(t => t.id === entrega.tareaId);
        const estudiante = usuarios.find(u => u.id === entrega.estudianteId);
        
        return {
          ...entrega,
          tarea: tarea ? {
            id: tarea.id,
            titulo: tarea.titulo,
            fechaLimite: tarea.fechaLimite,
            puntaje: tarea.puntaje,
            cursoId: tarea.cursoId
          } : null,
          estudiante: estudiante ? {
            id: estudiante.id,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            email: estudiante.email
          } : null
        };
      });
    
    // Agrupar por tarea para facilitar la visualización
    const entregasAgrupadas = tareasDelCurso.map(tarea => {
      const entregasTarea = entregasDelCurso.filter(e => e.tareaId === tarea.id);
      return {
        tarea: {
          id: tarea.id,
          titulo: tarea.titulo,
          descripcion: tarea.descripcion || null,
          fechaLimite: tarea.fechaLimite,
          puntaje: tarea.puntaje,
          cursoId: tarea.cursoId
        },
        entregas: entregasTarea || [],
        totalEntregas: entregasTarea.length,
        entregasCalificadas: entregasTarea.filter(e => e.estado === 'CALIFICADA').length,
        entregasPendientes: entregasTarea.filter(e => e.estado === 'ENTREGADA').length
      };
    });
    
    // Asegurar que siempre devolvemos un array, incluso si está vacío
    res.json({
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        codigo: curso.codigo
      },
      entregas: entregasAgrupadas || [],
      total: entregasDelCurso.length || 0
    });
  } catch (error) {
    console.error('Error en endpoint de entregas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al cargar entregas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==================== RUTAS DE MATRÍCULAS ====================
app.post('/api/v1/matriculas', authenticateToken, (req, res) => {
  const { cursoId, estudianteId } = req.body;
  
  // Los estudiantes solo pueden matricularse a sí mismos
  // Los docentes/ADMIN pueden añadir estudiantes especificando el estudianteId
  let idEstudiante;
  
  if (req.user.rol === 'ESTUDIANTE') {
    idEstudiante = req.user.id;
    // Los estudiantes no pueden especificar otro estudianteId
    if (estudianteId && estudianteId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permisos para matricular a otros estudiantes' });
    }
  } else if (req.user.rol === 'DOCENTE' || req.user.rol === 'ADMIN') {
    if (!estudianteId) {
      return res.status(400).json({ message: 'Debes especificar el ID del estudiante' });
    }
    idEstudiante = parseInt(estudianteId);
  } else {
    return res.status(403).json({ message: 'No tienes permisos para crear matrículas' });
  }

  if (!cursoId || !idEstudiante) {
    return res.status(400).json({ message: 'Curso y estudiante son requeridos' });
  }

  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  // Verificar que el estudiante exista y tenga rol ESTUDIANTE
  const estudiante = usuarios.find(u => u.id === idEstudiante && u.activo);
  if (!estudiante) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }
  
  if (estudiante.rol !== 'ESTUDIANTE') {
    return res.status(400).json({ message: 'El usuario especificado no es un estudiante' });
  }

  // Si es DOCENTE, verificar que sea el creador del curso
  if (req.user.rol === 'DOCENTE' && curso.creadorId !== req.user.id) {
    return res.status(403).json({ message: 'Solo puedes añadir estudiantes a tus propios cursos' });
  }

  const matriculaExistente = matriculas.find(
    m => m.cursoId === cursoId && m.estudianteId === idEstudiante && m.activa
  );

  if (matriculaExistente) {
    return res.status(400).json({ message: 'El estudiante ya está matriculado en este curso' });
  }

  const nuevaMatricula = {
    id: contadores.matriculas++,
    estudianteId: idEstudiante,
    cursoId,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  matriculas.push(nuevaMatricula);
  
  // Incluir información del estudiante en la respuesta
  const { password: _, ...estudianteSinPassword } = estudiante;
  res.status(201).json({
    ...nuevaMatricula,
    estudiante: estudianteSinPassword
  });
});

app.get('/api/v1/matriculas/mis-cursos', authenticateToken, requireRole('ESTUDIANTE'), (req, res) => {
  const misMatriculas = matriculas.filter(
    m => m.estudianteId === req.user.id && m.activa
  );

  const cursosConInfo = misMatriculas.map(matricula => {
    const curso = cursos.find(c => c.id === matricula.cursoId);
    return {
      ...matricula,
      curso: curso || null
    };
  });

  res.json(cursosConInfo);
});

// Obtener estudiantes matriculados en un curso (para docentes)
app.get('/api/v1/cursos/:id/estudiantes', authenticateToken, (req, res) => {
  const cursoId = parseInt(req.params.id);
  const curso = cursos.find(c => c.id === cursoId);
  
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  // Solo el docente creador, ADMIN o estudiantes matriculados pueden ver la lista
  if (req.user.rol === 'DOCENTE' && curso.creadorId !== req.user.id) {
    return res.status(403).json({ message: 'No tienes permisos para ver los estudiantes de este curso' });
  }

  const matriculasCurso = matriculas.filter(
    m => m.cursoId === cursoId && m.activa
  );

  const estudiantes = matriculasCurso.map(matricula => {
    const estudiante = usuarios.find(u => u.id === matricula.estudianteId);
    if (!estudiante) return null;
    
    const { password: _, ...estudianteSinPassword } = estudiante;
    return {
      ...estudianteSinPassword,
      matriculaId: matricula.id,
      fechaMatricula: matricula.createdAt
    };
  }).filter(Boolean);

  res.json({
    curso: {
      id: curso.id,
      titulo: curso.titulo,
      codigo: curso.codigo
    },
    estudiantes,
    total: estudiantes.length
  });
});

// Obtener lista de estudiantes disponibles (para docentes/ADMIN)
app.get('/api/v1/admin/estudiantes', authenticateToken, requireRole('ADMIN', 'DOCENTE'), (req, res) => {
  const { search, page = 1, limit = 50 } = req.query;
  
  let estudiantes = usuarios.filter(u => u.rol === 'ESTUDIANTE' && u.activo);
  
  // Filtrar por búsqueda si se proporciona
  if (search) {
    const searchLower = search.toLowerCase();
    estudiantes = estudiantes.filter(e => 
      e.nombre.toLowerCase().includes(searchLower) ||
      e.apellido.toLowerCase().includes(searchLower) ||
      e.email.toLowerCase().includes(searchLower) ||
      e.id.toString().includes(searchLower)
    );
  }

  const estudiantesSinPassword = estudiantes.map(({ password, ...estudiante }) => estudiante);

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginados = estudiantesSinPassword.slice(start, end);

  res.json({
    data: paginados,
    meta: {
      total: estudiantesSinPassword.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(estudiantesSinPassword.length / limit)
    }
  });
});

// ==================== RUTAS DE MENSAJES ====================
app.get('/api/v1/mensajes/curso/:cursoId', authenticateToken, (req, res) => {
  const cursoId = parseInt(req.params.cursoId);
  const { page = 1, limit = 50 } = req.query;

  const mensajesCurso = mensajes
    .filter(m => m.cursoId === cursoId)
    .sort((a, b) => a.createdAt - b.createdAt);

  const mensajesConUsuario = mensajesCurso.map(mensaje => {
    const usuario = usuarios.find(u => u.id === mensaje.usuarioId);
    return {
      ...mensaje,
      usuario: usuario ? {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
      } : null
    };
  });

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginados = mensajesConUsuario.slice(start, end);

  res.json({
    data: paginados,
    meta: {
      total: mensajesConUsuario.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(mensajesConUsuario.length / limit)
    }
  });
});

app.post('/api/v1/mensajes', authenticateToken, (req, res) => {
  const { contenido, cursoId } = req.body;

  if (!contenido || !cursoId) {
    return res.status(400).json({ message: 'Contenido y curso son requeridos' });
  }

  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  const nuevoMensaje = {
    id: contadores.mensajes++,
    contenido,
    cursoId,
    usuarioId: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mensajes.push(nuevoMensaje);

  const usuario = usuarios.find(u => u.id === req.user.id);
  res.status(201).json({
    ...nuevoMensaje,
    usuario: usuario ? {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol
    } : null
  });
});

// ==================== RUTAS DE MATERIALES ====================
app.get('/api/v1/materiales/clase/:claseId', authenticateToken, (req, res) => {
  const claseId = parseInt(req.params.claseId);
  const materialesClase = materiales.filter(m => m.claseId === claseId && m.activo);
  res.json(materialesClase);
});

app.post('/api/v1/materiales', authenticateToken, requireRole('ADMIN', 'DOCENTE'), (req, res) => {
  const { titulo, descripcion, archivoUrl, tipo, tamano, claseId } = req.body;

  if (!titulo || !archivoUrl || !claseId) {
    return res.status(400).json({ message: 'Título, archivo y clase son requeridos' });
  }

  const nuevoMaterial = {
    id: contadores.materiales++,
    titulo,
    descripcion: descripcion || null,
    archivoUrl,
    tipo: tipo || 'UNKNOWN',
    tamano: tamano || 0,
    claseId,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  materiales.push(nuevoMaterial);
  res.status(201).json(nuevoMaterial);
});

app.get('/api/v1/materiales/download-url/:filename', authenticateToken, (req, res) => {
  // En producción, esto generaría una URL firmada para descargar el archivo
  const url = `/uploads/${req.params.filename}`;
  res.json(url);
});

// ==================== RUTAS DE ADMINISTRACIÓN ====================
app.get('/api/v1/admin/stats', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const stats = {
    resumen: {
      totalUsuarios: usuarios.filter(u => u.activo).length,
      totalCursos: cursos.filter(c => c.activo).length,
      totalTareas: tareas.filter(t => t.activa).length,
      totalMensajes: mensajes.length
    },
    usuariosPorRol: [
      { rol: 'ADMIN', cantidad: usuarios.filter(u => u.rol === 'ADMIN' && u.activo).length },
      { rol: 'DOCENTE', cantidad: usuarios.filter(u => u.rol === 'DOCENTE' && u.activo).length },
      { rol: 'ESTUDIANTE', cantidad: usuarios.filter(u => u.rol === 'ESTUDIANTE' && u.activo).length }
    ],
    cursosRecientes: cursos
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(curso => {
        const clasesCount = clases.filter(cl => cl.cursoId === curso.id).length;
        const matriculasCount = matriculas.filter(m => m.cursoId === curso.id && m.activa).length;
        return {
          ...curso,
          _count: {
            clases: clasesCount,
            matriculas: matriculasCount
          }
        };
      }),
    usuariosRecientes: usuarios
      .filter(u => u.activo)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(({ password, ...user }) => user)
  };

  res.json(stats);
});

app.get('/api/v1/admin/usuarios', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { page = 1, limit = 10, rol, activo } = req.query;
  
  let usuariosFiltrados = [...usuarios];
  
  if (rol) {
    usuariosFiltrados = usuariosFiltrados.filter(u => u.rol === rol);
  }
  
  if (activo !== undefined) {
    usuariosFiltrados = usuariosFiltrados.filter(u => u.activo === (activo === 'true'));
  }

  const usuariosSinPassword = usuariosFiltrados.map(({ password, ...user }) => user);

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginados = usuariosSinPassword.slice(start, end);

  res.json({
    data: paginados,
    meta: {
      total: usuariosSinPassword.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(usuariosSinPassword.length / limit)
    }
  });
});

app.patch('/api/v1/admin/usuarios/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { nombre, apellido, email, rol, activo } = req.body;

  if (nombre) usuario.nombre = nombre;
  if (apellido) usuario.apellido = apellido;
  if (email) {
    if (usuarios.find(u => u.email === email && u.id !== usuario.id)) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }
    usuario.email = email;
  }
  if (rol) usuario.rol = rol;
  if (activo !== undefined) usuario.activo = activo;
  usuario.updatedAt = new Date();

  const { password: _, ...userWithoutPassword } = usuario;
  res.json(userWithoutPassword);
});

app.delete('/api/v1/admin/usuarios/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  if (usuarios[index].id === req.user.id) {
    return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
  }

  usuarios.splice(index, 1);
  res.status(204).send();
});

// ==================== RUTAS DE CALIFICACIONES ====================
app.get('/api/v1/calificaciones/mis-calificaciones', authenticateToken, requireRole('ESTUDIANTE'), (req, res) => {
  const misEntregas = entregas.filter(
    e => e.estudianteId === req.user.id && e.estado === 'CALIFICADA'
  );

  const calificaciones = misEntregas.map(entrega => {
    const tarea = tareas.find(t => t.id === entrega.tareaId);
    const curso = tarea ? cursos.find(c => c.id === tarea.cursoId) : null;
    const creadorCurso = curso ? usuarios.find(u => u.id === curso.creadorId) : null;
    
    return {
      id: entrega.id,
      puntaje: entrega.calificacion,
      fechaEntrega: entrega.createdAt,
      comentarios: entrega.comentario,
      tarea: tarea ? {
        id: tarea.id,
        titulo: tarea.titulo,
        puntajeMaximo: tarea.puntaje
      } : null,
      curso: curso ? {
        id: curso.id,
        titulo: curso.titulo
      } : null,
      profesor: creadorCurso ? {
        nombre: `${creadorCurso.nombre} ${creadorCurso.apellido}`
      } : {
        nombre: 'Docente'
      }
    };
  });

  res.json(calificaciones);
});

// ==================== RUTAS DE DASHBOARD ====================
app.get('/api/v1/dashboard/stats', authenticateToken, (req, res) => {
  let stats = {};

  if (req.user.rol === 'ESTUDIANTE') {
    const misCursosIds = matriculas
      .filter(m => m.estudianteId === req.user.id && m.activa)
      .map(m => m.cursoId);
    
    const misTareas = tareas.filter(t => misCursosIds.includes(t.cursoId));
    const misEntregas = entregas.filter(e => e.estudianteId === req.user.id);

    stats = {
      misCursos: misCursosIds.length,
      tareasPendientes: misTareas.filter(t => 
        !misEntregas.find(e => e.tareaId === t.id)
      ).length,
      tareasCompletadas: misEntregas.filter(e => e.estado === 'CALIFICADA').length,
      mensajes: mensajes.filter(m => misCursosIds.includes(m.cursoId)).length
    };
  } else if (req.user.rol === 'DOCENTE') {
    const misCursos = cursos.filter(c => c.creadorId === req.user.id);
    const misCursosIds = misCursos.map(c => c.id);
    
    stats = {
      misCursos: misCursos.length,
      totalEstudiantes: matriculas.filter(m => 
        misCursosIds.includes(m.cursoId) && m.activa
      ).length,
      tareasActivas: tareas.filter(t => 
        misCursosIds.includes(t.cursoId) && t.activa
      ).length,
      entregasPendientes: entregas.filter(e => {
        const tarea = tareas.find(t => t.id === e.tareaId);
        return tarea && misCursosIds.includes(tarea.cursoId) && e.estado === 'ENTREGADA';
      }).length
    };
  } else if (req.user.rol === 'ADMIN') {
    stats = {
      totalUsuarios: usuarios.filter(u => u.activo).length,
      totalCursos: cursos.filter(c => c.activo).length,
      totalTareas: tareas.filter(t => t.activa).length,
      totalMensajes: mensajes.length
    };
  }

  res.json(stats);
});

// ==================== RUTA DE HEALTH CHECK ====================
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==================== RUTA 404 ====================
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ==================== MANEJO DE ERRORES ====================
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════
║          🚀 SERVIDOR LMS EDUCATIVO 🚀             
╠════════════════════════════════════════════════════
║  Servidor:  http://localhost:${PORT}               
║  API:       http://localhost:${PORT}/api/v1        
║  Estado:    Ejecutándose ✓                         
╠════════════════════════════════════════════════════
║  👥 USUARIOS DE PRUEBA:                            
║  ┌──────────────────────────────────────────────┐ 
║  │ Admin:       admin@lms.com / password        │ 
║  │ Docente:     docente@lms.com / password      │ 
║  │ Estudiante:  estudiante@lms.com / password   │ 
║  └──────────────────────────────────────────────┘ 
╠════════════════════════════════════════════════════
║  📊 ESTADÍSTICAS:                                 
║  • Usuarios:     ${usuarios.length} registrados                   ║
║  • Cursos:       ${cursos.length} disponibles                     ║
║  • Tareas:       ${tareas.length} activas                         ║
║  • Matrículas:   ${matriculas.length} activas                     ║
╚════════════════════════════════════════════════════
  `);
});

module.exports = app