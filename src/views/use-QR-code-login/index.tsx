import { computed, ref } from "vue";

interface QRCodeData {
  qrCodeUrl: string;
  token: string;
}

interface LoginStatus {
  status: "pending" | "scanned" | "success" | "failed";
  message?: string;
}

export function useQRCodeLogin() {
  const qrCodeUrl = ref<string | null>(null);
  const loginStatus = ref<LoginStatus>({ status: "pending" });
  const pollingInterval = ref<number>(2000);
  let pollingTimer: ReturnType<typeof setInterval> | null = null;

  const isLoading = computed(() => loginStatus.value.status === "pending");
}
