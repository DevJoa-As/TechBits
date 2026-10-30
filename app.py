import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import psycopg2  # Conector para PostgreSQL en la nube

app = Flask(__name__, static_folder='static', template_folder='static')
CORS(app)

# URL de conexión a Supabase (obtenida de las variables de entorno de Render o de respaldo local)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:TetuContraseñaAqui@db.pvwjuvpbtdwsipeginvb.supabase.co:5432/postgres")

def get_db_connection():
    # Establece la conexión segura con PostgreSQL
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla para el formulario de contacto (PostgreSQL usa SERIAL para auto-incremental)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contactos (
            id SERIAL PRIMARY KEY,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            mensaje TEXT NOT NULL
        )
    ''')
    
    # Tabla para almacenar productos del catálogo
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id SERIAL PRIMARY KEY,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            descripcion TEXT
        )
    ''')
    
    # Insertar productos iniciales si la tabla está vacía
    cursor.execute('SELECT COUNT(*) FROM productos')
    if cursor.fetchone()[0] == 0:
        productos_iniciales = [
            ('Llavero Inteligente NFC', 12.00, 'Comparte tus redes sociales al instante.'),
            ('Desarrollo Web & Perfiles', 25.00, 'Landing pages personalizadas.'),
            ('Kit de Cuidado & Limpieza', 8.50, 'Mantenimiento para equipos.'),
            ('Merchandising Oficial', 10.00, 'Termos mate y tazas exclusivas.')
        ]
        cursor.executemany('INSERT INTO productos (nombre, precio, descripcion) VALUES (%s, %s, %s)', productos_iniciales)
    
    conn.commit()
    cursor.close()
    conn.close()

# Ruta principal que sirve la página web
@app.route('/')
def index():
    return render_template('index.html')

# API Endpoint para recibir los datos del formulario de contacto y guardarlos en la BD
@app.route('/api/contacto', methods=['POST'])
def guardar_contacto():
    data = request.json
    nombre = data.get('nombre')
    email = data.get('email')
    mensaje = data.get('mensaje')
    
    if not nombre or not email or not mensaje:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    # PostgreSQL utiliza %s como comodín de parámetros
    cursor.execute('INSERT INTO contactos (nombre, email, mensaje) VALUES (%s, %s, %s)', (nombre, email, mensaje))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Mensaje guardado en la base de datos de Supabase correctamente'})

# API Endpoint para obtener los productos desde la base de datos dinámicamente
@app.route('/api/productos', methods=['GET'])
def obtener_productos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, nombre, precio, descripcion FROM productos')
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    productos = [{'id': r[0], 'nombre': r[1], 'precio': r[2], 'descripcion': r[3]} for r in rows]
    return jsonify(productos)

if __name__ == '__main__':
    init_db()
    print("Servidor backend de TechBits corriendo en http://127.0.0.1:5000 con Supabase")
    app.run(debug=True)