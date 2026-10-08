import { Router } from 'express';

const router = Router();

const NHTSA_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';


// ==========================
// OBTENER TODAS LAS MARCAS
// ==========================

router.get('/makes', async (_req, res) => {
  try {

    const response = await fetch(
      `${NHTSA_URL}/GetAllMakes?format=json`
    );

    if (!response.ok) {
      throw new Error('Error al consultar NHTSA');
    }

    const data = await response.json();

    res.json(data);

  } catch (error) {

    console.error('Error NHTSA makes:', error);

    res.status(500).json({
      message: 'No se pudieron obtener las marcas de NHTSA'
    });

  }
});


// ==========================
// OBTENER MODELOS
// MARCA + AÑO
// ==========================

router.get('/models/:make/:year', async (req, res) => {
  try {
    const { make, year } = req.params;

    const response = await fetch(
      `${NHTSA_URL}/GetModelsForMakeYear/make/${encodeURIComponent(
        make
      )}/modelyear/${year}?format=json`
    );

    if (!response.ok) {
      throw new Error('Error al consultar NHTSA');
    }

    const data: any = await response.json();

    // Filtrar únicamente la marca exacta
    const models = data.Results.filter(
      (vehicle: any) =>
        vehicle.Make_Name.toLowerCase() === make.toLowerCase()
    );

    res.json({
      Count: models.length,
      Results: models
    });

  } catch (error) {
    console.error('Error NHTSA models:', error);

    res.status(500).json({
      message: 'No se pudieron obtener los modelos de NHTSA'
    });
  }
});

export default router;