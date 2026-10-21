import Swal from "sweetalert2";

// Academic custom-styled SweetAlert instance matching UniReportTZ branding
export const academicSwal = Swal.mixin({
  customClass: {
    popup: "rounded-2xl border border-slate-700/60 bg-[#0A192F] text-white shadow-2xl font-sans",
    title: "text-xl font-bold font-heading text-white",
    htmlContainer: "text-sm text-slate-300 leading-relaxed font-sans",
    confirmButton: "px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all mx-1.5",
    cancelButton: "px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all mx-1.5",
  },
  buttonsStyling: false,
  background: "#0A192F",
  color: "#f8fafc",
});

// Toast notification instance
export const toastSwal = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#0F213E",
  color: "#ffffff",
  customClass: {
    popup: "rounded-xl border border-teal-500/30 shadow-xl text-xs",
  },
  didOpen: (toast: HTMLElement) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const AcademicAlerts = {
  success: (title: string, text?: string) => {
    return academicSwal.fire({
      icon: "success",
      iconColor: "#14b8a6",
      title,
      text,
      confirmButtonText: "Continue",
    });
  },

  error: (title: string, text?: string) => {
    return academicSwal.fire({
      icon: "error",
      iconColor: "#ef4444",
      title,
      text,
      confirmButtonText: "Understood",
    });
  },

  info: (title: string, text?: string) => {
    return academicSwal.fire({
      icon: "info",
      iconColor: "#38bdf8",
      title,
      text,
      confirmButtonText: "Got it",
    });
  },

  warning: (title: string, text?: string) => {
    return academicSwal.fire({
      icon: "warning",
      iconColor: "#f59e0b",
      title,
      text,
      confirmButtonText: "Acknowledge",
    });
  },

  confirm: async (title: string, text: string, confirmText = "Proceed") => {
    const result = await academicSwal.fire({
      icon: "question",
      iconColor: "#14b8a6",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    return result.isConfirmed;
  },

  loading: (title: string, text: string) => {
    academicSwal.fire({
      title,
      html: `
        <div class="flex flex-col items-center gap-3 py-2">
          <div class="size-10 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin"></div>
          <p class="text-xs text-slate-300">${text}</p>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  },

  close: () => {
    Swal.close();
  },

  toast: (title: string, icon: "success" | "error" | "warning" | "info" = "success") => {
    return toastSwal.fire({
      icon,
      iconColor: icon === "success" ? "#14b8a6" : icon === "error" ? "#ef4444" : "#38bdf8",
      title,
    });
  },
};

export default AcademicAlerts;
