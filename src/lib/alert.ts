import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "font-sans text-xs rounded-2xl shadow-xl",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showAlert = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "font-sans rounded-3xl p-6",
        confirmButton: "font-sans font-bold px-6 py-2.5 rounded-xl text-sm",
      },
    });
  },
  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#e11d48",
      customClass: {
        popup: "font-sans rounded-3xl p-6",
        confirmButton: "font-sans font-bold px-6 py-2.5 rounded-xl text-sm",
      },
    });
  },
  confirm: async (title: string, text: string, confirmText = "Ya, Lanjutkan") => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: confirmText,
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: "font-sans rounded-3xl p-6",
        confirmButton: "font-sans font-bold px-5 py-2.5 rounded-xl text-xs",
        cancelButton: "font-sans font-bold px-5 py-2.5 rounded-xl text-xs",
      },
    });
  },
};
