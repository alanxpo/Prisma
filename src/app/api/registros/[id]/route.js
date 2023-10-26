import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, { params: { id } }) {
  try {
    const estudiante = await prisma.estudiante.findFirst({
      where: { id: Number(id) },
    });

    if (!estudiante) {
      return NextResponse.json(
        {
          mensaje: "El estudiante no existe",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(estudiante);
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ mensaje: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params: { id } }) {
  try {
    const estudiante = await prisma.estudiante.delete({
      where: { id: Number(id) },
    });

    if (!estudiante) {
      return NextResponse.json(
        {
          mensaje: "El estudiante no existe",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      mensaje: "Estudiante eliminado correctamente",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ mensaje: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request, { params: { id } }) {
  try {
    const { nombre, genero, edad, carrera } = await request.json();

    const estudianteExistente = await prisma.estudiante.findFirst({
      where: { id: Number(id) },
    });

    if (!estudianteExistente) {
      return NextResponse.json(
        {
          mensaje: "El estudiante no existe",
        },
        { status: 404 }
      );
    }

    const estudianteActualizado = await prisma.estudiante.update({
      where: { id: Number(id) },
      data: { nombre, genero, edad, carrera },
    });

    return NextResponse.json(estudianteActualizado);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ mensaje: error.message }, { status: 500 });
    }
  }
}
