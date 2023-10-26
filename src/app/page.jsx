"use client";
import { useState, useEffect, useRef } from "react";
import StudentTable from "@/components/StudentTable";

const PostComponent = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    genero: "",
    edad: "",
    carrera: "",
  });
  const [students, setStudents] = useState([]);
  const [response, setResponse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const formRef = useRef(null);

  async function fetchStudents() {
    const response = await fetch("/api/registros");
    if (!response.ok) {
      throw new Error("Hubo un error al realizar la solicitud.");
    }
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    fetchStudents()
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error(error);
        setResponse({ mensaje: error.message });
      });
  }, []);

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setIsEditing(false);
      closeAddForm();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = (id) => {
    fetch(`/api/registros/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Hubo un error al realizar la solicitud.");
        }
      })
      .then(({ mensaje }) => {
        setResponse({ mensaje });
        setStudents(students.filter((student) => student.id !== id));
        handleCancel();
      })
      .catch((error) => {
        console.error(error);
        setResponse({ mensaje: error.message });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, edad: parseInt(formData.edad, 10) };

    fetch("/api/registros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Hubo un error al realizar la solicitud.");
        }
      })
      .then((data) => {
        setStudents([...students, data]);
        handleCancel();
      })
      .catch((error) => {
        console.error(error);
        setResponse({ mensaje: error.message });
      });
  };

  const handleEdit = (student) => {
    setFormData({
      nombre: student.nombre,
      genero: student.genero,
      edad: student.edad,
      carrera: student.carrera,
    });
    setIsEditing(true);
    setEditStudentId(student.id);
    openAddForm();
  };

  const handleUpdate = () => {
    const updatedData = { ...formData, edad: parseInt(formData.edad, 10) };

    fetch(`/api/registros/${editStudentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            "Hubo un error al realizar la solicitud de actualización."
          );
        }
      })
      .then((updatedStudent) => {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === editStudentId ? updatedStudent : student
          )
        );
        setEditStudentId(null);
        handleCancel();
      })
      .catch((error) => {
        console.error(error);
        setResponse({
          mensaje: error.message,
        });
      });
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      genero: "",
      edad: "",
      carrera: "",
    });
    setIsEditing(false);
    closeAddForm();
  };

  const openAddForm = () => {
    setShowAddForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col sm:flex-row justify-center">
      <div className="w-full sm:w-2/3 p-5">
        <div className="flex justify-between py-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Lista de Estudiantes
          </h2>
          <button
            onClick={openAddForm}
            className="bg-blue-500 hover:bg-blue-600 rounded p-2 text-white"
          >
            Agregar Estudiante
          </button>
        </div>
        <StudentTable
          students={students}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
      {showAddForm && (
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center "
          onClick={handleClickOutside}
        >
          <div className="w-full sm:w-1/3 p-5 bg-white rounded-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {isEditing ? "Actualizar estudiante" : "Agregar estudiante"}
            </h2>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-lg shadow-lg bg-white p-4"
            >
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-black">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="input-field bg-white text-black text-sm md:text-base lg:text-lg rounded shadow-md p-2 w-full"
                  placeholder="Nombre"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="genero" className="block text-black">
                  Género
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  className="input-field bg-white text-black text-sm md:text-base lg:text-lg rounded shadow-md p-2 w-full"
                  required
                >
                  <option value="" disabled>
                    Selecciona tu género
                  </option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="edad" className="block text-black">
                  Edad
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="input-field bg-white text-black text-sm md:text-base lg:text-lg rounded shadow-md p-2 w-full"
                  placeholder="Introduce tu edad"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="carrera" className="block text-black">
                  Carrera
                </label>
                <select
                  id="carrera"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleInputChange}
                  className="input-field bg-white text-black text-sm md:text-base lg:text-lg rounded shadow-md p-2 w-full"
                  required
                >
                  <option value="" disabled>
                    Selecciona tu carrera
                  </option>
                  <option value="Ing. en Innovación Agrícola Sustentable">
                    Ingeniería en Innovación Agrícola Sustentable
                  </option>
                  <option value="Ing. Electromecánica">
                    Ingeniería Electromecánica
                  </option>
                  <option value="Ing. Electrónica">
                    Ingeniería Electrónica
                  </option>
                  <option value="Ing. en Gestión Empresarial">
                    Ingeniería en Gestión Empresarial
                  </option>
                  <option value="Ing. Industrial">Ingeniería Industrial</option>
                  <option value="Ing.Mecatrónica">
                    Ingeniería Mecatrónica
                  </option>
                  <option value="Ing. en Sistemas Computacionales">
                    Ingeniería en Sistemas Computacionales
                  </option>
                  <option value="Lic. en Administración">
                    Licenciatura en Administración
                  </option>
                </select>
              </div>
              {isEditing ? (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="action-button bg-green-500 hover:bg-green-600 p-2 rounded shadow-md text-white"
                  >
                    Actualizar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="action-button bg-red-500 hover:bg-red-600 p-2 rounded shadow-md ml-2 text-white"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 p-2 rounded shadow-md text-white"
                  >
                    Enviar
                  </button>
                  <button
                    type="button"
                    onClick={closeAddForm}
                    className="action-button bg-red-500 hover:bg-red-600 p-2 rounded shadow-md ml-2 text-white"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
