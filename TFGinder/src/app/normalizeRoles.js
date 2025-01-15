const admin = require('firebase-admin');

// Inicializa Firebase Admin SDK
const serviceAccount = require('./ruta/credenciales.json'); // Reemplaza con tu archivo de credenciales

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function normalizeRoles() {
  const usersCollection = db.collection('users');
  const snapshot = await usersCollection.get();

  if (snapshot.empty) {
    console.log('No se encontraron usuarios en la colección.');
    return;
  }

  snapshot.forEach(async (doc) => {
    const data = doc.data();
    // Si existe 'rol' pero no 'role', actualizamos el documento
    if (data.rol && !data.role) {
      try {
        await usersCollection.doc(doc.id).update({
          role: data.rol, // Copiamos el valor de 'rol' a 'role'
        });
        console.log(`Actualizado documento ${doc.id}: rol -> role`);
      } catch (error) {
        console.error(`Error actualizando documento ${doc.id}:`, error);
      }
    }
  });

  console.log('Normalización completada.');
}

// Ejecutar el script
normalizeRoles().catch((err) => {
  console.error('Error al ejecutar el script:', err);
});
