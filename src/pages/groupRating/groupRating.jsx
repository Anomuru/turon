import React, {useEffect, useState} from 'react';
import cls from './groupRating.module.sass';
import {API_URL, headers} from 'shared/api/base.js';

const getColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes('blue')) return 'blue';
    if (n.includes('red')) return 'red';
    if (n.includes('green')) return 'green';
    return 'gray';
};

const getInitials = (name) =>
    name.split(/[\s\-()+]/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');

const StarRating = ({rating, color}) => (
    <div className={cls.stars}>
        {Array.from({length: 5}, (_, i) => (
            <div key={i} className={`${cls.star} ${i < Math.round(rating) ? cls[`star_${color}`] : cls.starOff}`}/>
        ))}
    </div>
);

const GroupCard = ({item}) => {
    const color = getColor(item.name);
    return (
        <div className={cls.card}>
            <div className={cls.cardTop}>
                <div className={`${cls.avatar} ${cls[`av_${color}`]}`}>
                    {getInitials(item.name)}
                </div>
                <div>
                    <div className={cls.cardName}>{item.name}</div>
                    <span className={`${cls.badge} ${item.status ? cls.badgeActive : cls.badgeInactive}`}>
                        {item.status ? 'Faol' : 'Nofaol'}
                    </span>
                </div>
            </div>
            <div className={cls.divider}/>
            <div className={cls.row}>
                <span className={cls.lbl}>Ball</span>
                <StarRating rating={item.avg_rating} color={color}/>
            </div>
            <div className={cls.row}>
                <span className={cls.lbl}>O'rtacha</span>
                <span className={cls.val}>
                    {item.total_ratings > 0 ? `${item.avg_rating.toFixed(1)} / 5` : '—'}
                </span>
            </div>
            <div className={cls.row}>
                <span className={cls.lbl}>Baholashlar</span>
                <span className={cls.val}>{item.total_ratings}</span>
            </div>
            <div className={cls.row}>
                <span className={cls.lbl}>So'nggi sana</span>
                <span className={cls.date}>{item.last_rated_date || '—'}</span>
            </div>
            {item.last_comment && (
                <div className={cls.comment}>"{item.last_comment}"</div>
            )}
        </div>
    );
};

export const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [colorFilter, setColorFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const branchId = localStorage.getItem('branchId');

    useEffect(() => {
        if (from && to) {
            fetch(`${API_URL}Group/with-ratings/?branch_id=${branchId}&date_from=${from}&date_to=${to}`, {
                method: 'GET',
                headers: headers()
            })
                .then(res => res.json())
                .then(data => {
                    setGroups(data.results || []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [from, to]);

    const filtered = groups.filter(item => {
        if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (colorFilter !== 'all' && getColor(item.name) !== colorFilter) return false;
        if (ratingFilter === 'rated' && item.total_ratings === 0) return false;
        if (ratingFilter === 'unrated' && item.total_ratings > 0) return false;
        return true;
    });

    const rated = filtered.filter(i => i.total_ratings > 0);
    const avgScore = rated.length
        ? (rated.reduce((s, i) => s + i.avg_rating, 0) / rated.length).toFixed(1)
        : '—';

    // if (loading) return <div className={cls.loading}>Yuklanmoqda...</div>;

    return (
        <div className={cls.main}>
            <div className={cls.stats}>
                {[
                    {label: 'Jami guruhlar', value: filtered.length},
                    {label: 'Baholangan', value: rated.length},
                    {label: "O'rtacha ball", value: avgScore},
                ].map(s => (
                    <div key={s.label} className={cls.stat}>
                        <div className={cls.statLabel}>{s.label}</div>
                        <div className={cls.statValue}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className={cls.filters}>
                <input
                    className={cls.searchInput}
                    type="text"
                    placeholder="Guruh nomi bo'yicha qidirish..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className={cls.filters2}>
                    <span>from</span>
                    <input
                        style={{maxWidth: "50px"}}
                        className={cls.searchInput}
                        type="date"
                        placeholder="Guruh nomi bo'yicha qidirish..."
                        value={to}
                        onChange={e => setTo(e.target.value)}
                    />
                </div>
                <div className={cls.filters2}>
                    <span>to</span>
                    <input
                        style={{maxWidth: "50px"}}
                        className={cls.searchInput}
                        type="date"
                        placeholder="Guruh nomi bo'yicha qidirish..."
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                    />
                </div>



                <select className={cls.select} value={colorFilter} onChange={e => setColorFilter(e.target.value)}>
                    <option value="all">Barcha rang</option>
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                </select>
                <select className={cls.select} value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                    <option value="all">Barcha holat</option>
                    <option value="rated">Baholangan</option>
                    <option value="unrated">Baholanmagan</option>
                </select>
            </div>

            {filtered.length === 0
                ? <div className={cls.empty}>Iltimos sana tanlang !!!</div>
                : <div className={cls.grid}>
                    {filtered.map(item => <GroupCard key={item.id} item={item}/>)}
                </div>
            }
        </div>
    );
};