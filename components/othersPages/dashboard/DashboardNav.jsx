"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';

export default function DashboardNav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const accountLinks = [
    { href: "/my-account", label: t("account.dashboard") },
    { href: "/my-account-orders", label: t("account.orders") },
    { href: "/my-account-address", label: t("account.address") },
    { href: "/my-account-edit", label: t("account.accountdetails") },
  ];

  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item ${pathname === link.href ? "active" : ""}`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}