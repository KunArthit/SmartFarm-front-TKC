import HomeClient from "./homeclient";

export const metadata = {
  title: "FarmSuk",
  description:
    "ระบบฟาร์มอัจฉริยะที่ใช้ IoT ช่วยควบคุมการเกษตรแบบเรียลไทม์ เหมาะสำหรับเกษตรกรยุคใหม่ ติดตั้งง่าย ควบคุมผ่านมือถือ",
  keywords: [
    "ฟาร์มอัจฉริยะ",
    "Smart Farm",
    "ระบบเกษตรอัจฉริยะ",
    "IoT ฟาร์ม",
    "ฟาร์มอัตโนมัติ",
    "farmsuk",
    "TKC",
    "Turnkey Communication Services",
  ],
  metadataBase: new URL("https://myfarmsuk.com/"),
};

export default function HomePage() {
  return <HomeClient />;
}
