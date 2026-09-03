"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "pks_admin_session";

// Inisialisasi darurat otomatis jika admin belum ada
async function ensureAdminExists() {
  const count = await prisma.userAdmin.count();
  if (count === 0) {
    await prisma.userAdmin.create({
      data: {
        username: "admin",
        password: hashPassword("admin"),
        name: "Administrator",
        role: "ADMIN",
      },
    });
  }
}

export async function loginAdmin(formData: FormData) {
  await ensureAdminExists();

  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { success: false, message: "Username dan password wajib diisi." };
  }

  const user = await prisma.userAdmin.findUnique({
    where: { username },
  });

  if (!user || !verifyPassword(password, user.password)) {
    return { success: false, message: "Username atau password salah!" };
  }

  // Set HTTP-Only Cookie Session
  cookies().set(SESSION_COOKIE_NAME, JSON.stringify({ id: user.id, username: user.username, name: user.name }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 Hari
    path: "/",
  });

  return { success: true };
}

export async function logoutAdmin() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

export async function getAdminSession() {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function changeAdminPassword(formData: FormData) {
  const currentSession = await getAdminSession();
  if (!currentSession) {
    return { success: false, message: "Sesi telah berakhir. Silakan login kembali." };
  }

  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Konfirmasi password baru tidak cocok." };
  }

  if (newPassword.length < 4) {
    return { success: false, message: "Password baru minimal 4 karakter." };
  }

  const user = await prisma.userAdmin.findUnique({
    where: { username: currentSession.username },
  });

  if (!user || !verifyPassword(oldPassword, user.password)) {
    return { success: false, message: "Password lama tidak sesuai!" };
  }

  await prisma.userAdmin.update({
    where: { id: user.id },
    data: {
      password: hashPassword(newPassword),
    },
  });

  return { success: true, message: "Password admin berhasil diperbarui!" };
}
