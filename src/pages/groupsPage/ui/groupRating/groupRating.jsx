import styles from  "./rating.module.scss"
import {useEffect, useState} from "react";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {useParams} from "react-router";
export const GroupRating = () => {
    const [data , setData] = useState([])

    const {id} = useParams();
    const {request} = useHttp()
    useEffect(() => {
        request(`${API_URL}Group/group-ratings/?group_id=${id}` , "GET" , null , headers())
            .then(res => setData(res))
    }, []);
    return(
        <div className={styles.wrap}>
            <div className={styles.header}>
                <span className={styles.title}>Baholashlar</span>
                <span className={styles.count}>{data.count} ta natija</span>
            </div>
            <div className={styles.grid}>
                {data?.results?.map((item) => (
                    <FeedbackCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}




function initials(name) {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatDateTime(isoStr) {
    const dt = new Date(isoStr);
    const time = dt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    return `${time} · ${formatDate(isoStr)}`;
}

function IconCalendar() {
    return (
        <svg className={styles.infoIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="14" height="11" rx="2" />
            <path d="M5 3V2M11 3V2M1 7h14" />
        </svg>
    );
}

function IconLocation() {
    return (
        <svg className={styles.infoIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
            <circle cx="8" cy="6" r="1.5" />
        </svg>
    );
}

 function FeedbackCard({ item }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardAccent} />

            <div className={styles.cardTop}>
                <div className={styles.meta}>
                    <span className={styles.cardId}># {item.id}</span>
                    <span className={styles.cardDate}>{formatDate(item.date)}</span>
                </div>
                <div className={styles.ratingBadge}>
                    <span className={styles.ratingNum}>{item.rating}</span>
                    <span className={styles.ratingLabel}>{item.rating_label}</span>
                </div>
            </div>

            <div className={styles.teacher}>
                <div className={styles.avatar}>{initials(item.teacher_name)}</div>
                <div className={styles.teacherInfo}>
                    <span className={styles.teacherName}>{item.teacher_name}</span>
                    <span className={styles.teacherSub}>O'qituvchi · ID {item.teacher}</span>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.infoRow}>
                <IconCalendar />
                <span className={styles.infoLabel}>Guruh</span>
                <span className={styles.infoValue}>{item.group_name}</span>
            </div>

            <div className={styles.infoRow}>
                <IconLocation />
                <span className={styles.infoLabel}>Filial</span>
                <span className={styles.infoValue}>{item.branch_name}</span>
            </div>

            {item.comment && (
                <div className={styles.commentBox}>
                    <div className={styles.commentLabel}>Izoh</div>
                    <div className={styles.commentText}>"{item.comment}"</div>
                </div>
            )}

            <div className={styles.createdAt}>{formatDateTime(item.created_at)} da yaratildi</div>
        </div>
    );
}
