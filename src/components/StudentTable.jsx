import React, { useState, useRef, useEffect } from "react";

const StudentTable = ({ students, handleEdit, handleDelete }) => {
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [activeStudent, setActiveStudent] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveStudent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredStudents = students.filter((student) => {
    return student.nombre.toLowerCase().includes(searchText.toLowerCase());
  });

  const sortedStudents = filteredStudents.sort((a, b) => {
    return a[sortBy] < b[sortBy] ? -1 : 1;
  });

  const toggleOptions = (student) => {
    if (activeStudent === student) {
      setActiveStudent(null);
    } else {
      setActiveStudent(student);
    }
  };

  const closeOptions = () => {
    setActiveStudent(null);
  };

  return (
    <div className="rounded-lg shadow-lg bg-white p-4">
      <div className="overflow-x-auto">
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Buscar estudiante"
            className="p-2 border border-gray-300 text-black rounded-md "
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            <select
              className="p-3 border border-gray-300 text-black ml-2 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">Sort By: ID</option>
              <option value="nombre">Sort By: Nombre</option>
              <option value="genero">Sort By: Género</option>
              <option value="edad">Sort By: Edad</option>
              <option value="carrera">Sort By: Carrera</option>
            </select>
          </div>
        </div>
        <table className="min-w-full text-black">
          <thead>
            <tr className=" text-gray-400 text-left">
              <th className="p-3 font-bold uppercase text-sm md:text-base lg:text-lg">
                ID
              </th>
              <th className="p-3 font-bold uppercase text-sm md:text-base lg:text-lg">
                Nombre
              </th>
              <th className="p-3 font-bold uppercase text-sm md:text-base lg:text-lg">
                Género
              </th>
              <th className="p-3 font-bold uppercase text-sm md:text-base lg:text-lg">
                Edad
              </th>
              <th className="p-3 font-bold uppercase text-sm md:text-base lg:text-lg">
                Carrera
              </th>
              <th className="p-3 font-bold uppercase text-sm md:text-base lg:text-lg">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay ningun registro
                </td>
              </tr>
            ) : (
              sortedStudents.map((student) => (
                <tr key={student.id} className="border-t-2">
                  <td className="p-4 text-sm md:text-base lg:text-lg">
                    {student.id}
                  </td>
                  <td className="p-4 text-sm md:text-base lg:text-lg">
                    {student.nombre}
                  </td>
                  <td className="p-2 text-sm md:text-base lg:text-lg">
                    {student.genero}
                  </td>
                  <td className="p-2 text-sm md:text-base lg:text-lg">
                    {student.edad}
                  </td>
                  <td className="p-2 text-sm md:text-base lg:text-lg">
                    {student.carrera}
                  </td>
                  <td className="p-2 text-sm md:text-base lg:text-lg text-center">
                    <button
                      onClick={() => toggleOptions(student)}
                      className="w-6 h-6 p-1 flex items-center justify-center cursor-pointer"
                    >
                      ···
                    </button>
                    {activeStudent === student && (
                      <div
                        ref={menuRef}
                        className="absolute w-24 bg-white border border-gray-300 flex flex-col"
                      >
                        <button
                          onClick={() => {
                            handleEdit(student);
                            closeOptions();
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer p-2 text-center bg-gray-100 hover:bg-blue-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(student.id);
                            closeOptions();
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-2 text-center bg-gray-100 hover:bg-red-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
