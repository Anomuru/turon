import { useEffect, useState } from "react";
import styles from "./steam.module.sass";
import {API_URL} from "shared/api/base.js";

/**
 * Admin panel — ro'yxatdan o'tgan arizalar jadvali.
 *
 * Backend hujjatiga mos:
 *   GET /api/website-sources/admin/registrations/
 *   ?branch=&search=&date_from=&date_to=&ordering=-created&limit=&offset=
 *
 * ESLATMA: bu endpoint admin uchun, demak autentifikatsiya talab qiladi.
 * Aniq usul (Bearer token / cookie session) hujjatda yozilmagan, shu sababli
 * `authToken` prop orqali token berish imkoniyati qo'yildi — agar sizda
 * boshqa auth usuli bo'lsa, pastdagi `headers` qismini moslang.
 */

const BRANCHES = [
    { id: 1, name: "Chilonzor" },
    { id: 2, name: "Yunusobod" },
    { id: 3, name: "Sergeli" },
];

const API_ENDPOINT = "website-sources/admin/registrations/";
const PAGE_SIZE_OPTIONS = [20, 30, 50 , 70 , 100];

const initialFilters = {
    search: "",
    branch: "",
    dateFrom: "",
    dateTo: "",
    ordering: "-created",
    limit: 20,
};

function formatPhoneDisplay(phone) {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length !== 12) return phone;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
}

function formatCreated(iso) {
    try {
        const date = new Date(iso);
        return date.toLocaleString("uz-UZ", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Tashkent",
        });
    } catch {
        return iso;
    }
}

export default function SteamLead({
                                               branches = BRANCHES,
                                               apiEndpoint = API_ENDPOINT,
                                               authToken = null,
                                           } = {}) {
    const [filters, setFilters] = useState(initialFilters);
    const [searchInput, setSearchInput] = useState("");
    const [offset, setOffset] = useState(0);
    const [data, setData] = useState({ count: 0, results: [] });
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMessage, setErrorMessage] = useState("");

    const branchId = localStorage.getItem("branchId");
    const branchNameById = Object.fromEntries(
        branches.map((branch) => [String(branch.id), branch.name])
    );

    // qidiruv maydonini debounce qilish — har harfda so'rov yubormaslik uchun
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }));
            setOffset(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let ignore = false;

        async function load() {
            setStatus("loading");
            setErrorMessage("");

            const params = new URLSearchParams();
            if (filters.search) params.set("search", filters.search);
            if (branchId) params.set("branch", branchId);
            if (filters.dateFrom) params.set("date_from", filters.dateFrom);
            if (filters.dateTo) params.set("date_to", filters.dateTo);
            params.set("ordering", filters.ordering);
            params.set("limit", String(filters.limit));
            params.set("offset", String(offset));

            try {
                const headers = {};
                if (authToken) headers.Authorization = `Bearer ${authToken}`;

                const response = await fetch(`${API_URL}${apiEndpoint}?${params.toString()}`, {
                    headers,
                });
                if (!response.ok) throw new Error("request_failed");

                const json = await response.json();
                if (!ignore) {
                    setData(json);
                    setStatus("success");
                }
            } catch {
                if (!ignore) {
                    setStatus("error");
                    setErrorMessage("Ro'yxatni yuklab bo'lmadi. Qayta urinib ko'ring.");
                }
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [filters, offset, apiEndpoint, authToken]);

    function updateFilter(key, value) {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setOffset(0);
    }

    function resetFilters() {
        setFilters(initialFilters);
        setSearchInput("");
        setOffset(0);
    }

    const total = data.count || 0;
    const limit = filters.limit;
    const results = data.results || [];
    const rangeStart = total === 0 ? 0 : offset + 1;
    const rangeEnd = Math.min(offset + limit, total);
    const hasPrev = offset > 0;
    const hasNext = offset + limit < total;
    const isLoading = status === "loading";

    return (
        <div className={styles.page}>


            <main className={styles.content}>
                <div className={styles.heading}>
                    <h1 className={styles.title}>Ro'yxatdan o'tganlar</h1>
                    <p className={styles.subtitle}>
                        Landing sahifadagi ariza formasidan kelgan so'rovlar ro'yxati.
                    </p>
                </div>

                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel} htmlFor="search">
                            Qidiruv
                        </label>
                        <input
                            id="search"
                            className={styles.filterInput}
                            type="text"
                            placeholder="Ism, familiya yoki telefon"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                        {/*<div className={styles.filterGroup}>*/}
                        {/*    <label className={styles.filterLabel} htmlFor="branch">*/}
                        {/*        Filial*/}
                        {/*    </label>*/}
                        {/*    <select*/}
                        {/*        id="branch"*/}
                        {/*        className={styles.filterInput}*/}
                        {/*        value={filters.branch}*/}
                        {/*        onChange={(e) => updateFilter("branch", e.target.value)}*/}
                        {/*    >*/}
                        {/*        <option value="">Barchasi</option>*/}
                        {/*        {branches.map((branch) => (*/}
                        {/*            <option value={branch.id} key={branch.id}>*/}
                        {/*                {branch.name}*/}
                        {/*            </option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*</div>*/}

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel} htmlFor="dateFrom">
                            Sanadan
                        </label>
                        <input
                            id="dateFrom"
                            className={styles.filterInput}
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => updateFilter("dateFrom", e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel} htmlFor="dateTo">
                            Sanagacha
                        </label>
                        <input
                            id="dateTo"
                            className={styles.filterInput}
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => updateFilter("dateTo", e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel} htmlFor="ordering">
                            Tartibi (registiratsiya qilingan sana buyicha yangi yoki eski )
                        </label>
                        <select
                            id="ordering"
                            className={styles.filterInput}
                            value={filters.ordering}
                            onChange={(e) => updateFilter("ordering", e.target.value)}
                        >
                            <option value="-created">Eng yangi</option>
                            <option value="created">Eng eski</option>
                        </select>
                    </div>

                    <button
                        className={styles.resetButton}
                        type="button"
                        onClick={resetFilters}
                    >
                        Filtrlarni tozalash
                    </button>
                </div>

                {status === "error" && (
                    <p className={styles.bannerError} role="alert">
                        {errorMessage}
                    </p>
                )}

                <div className={styles.tableCard}>
                    <div className={styles.tableScroll}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th scope="col" className={styles.thId}>
                                    No
                                </th>
                                <th scope="col">Ism</th>
                                <th scope="col">Familiya</th>
                                <th scope="col">Telefon</th>
                                <th scope="col">Filial</th>
                                <th scope="col">Sana</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((row , index) => (
                                <tr key={row.id}>
                                    <td className={styles.cellMono}>{index  + 1}</td>
                                    <td>{row.name}</td>
                                    <td>{row.surname}</td>
                                    <td className={styles.cellMono}>
                                        {formatPhoneDisplay(row.phone)}
                                    </td>
                                    <td>{row.branch_name}</td>
                                    <td className={styles.cellMono} title={row.created}>
                                        {formatCreated(row.created)}
                                    </td>
                                </tr>
                            ))}

                            {!isLoading && results.length === 0 && status === "success" && (
                                <tr>
                                    <td className={styles.emptyCell} colSpan={6}>
                                        Hozircha arizalar yo'q. Filtrlarni o'zgartirib ko'ring.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        {isLoading && (
                            <div className={styles.loadingOverlay}>
                                <span className={styles.spinner} aria-hidden="true" />
                                Yuklanmoqda…
                            </div>
                        )}
                    </div>

                    <div className={styles.pagination}>
            <span className={styles.rangeText}>
              {total === 0
                  ? "0 ta natija"
                  : `${rangeStart}–${rangeEnd} / ${total}`}
            </span>

                        <div className={styles.paginationControls}>
                            <label className={styles.perPageLabel} htmlFor="perPage">
                                Sahifada
                            </label>
                            <select
                                id="perPage"
                                className={styles.perPageSelect}
                                value={filters.limit}
                                onChange={(e) =>
                                    updateFilter("limit", Number(e.target.value))
                                }
                            >
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <option value={size} key={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>

                            <button
                                className={styles.pageButton}
                                type="button"
                                disabled={!hasPrev}
                                onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                            >
                                Oldingi
                            </button>
                            <button
                                className={styles.pageButton}
                                type="button"
                                disabled={!hasNext}
                                onClick={() => setOffset((prev) => prev + limit)}
                            >
                                Keyingi
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}