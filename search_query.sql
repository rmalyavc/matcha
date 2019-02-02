-- SELECT u.*, p.url AS avatar, ABS(l.latitude - 50.4447) + ABS(l.longitude - 30.5238) AS diff
-- FROM users u
-- LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = '1'
-- LEFT JOIN locations l ON l.user_id = u.id
-- WHERE u.id <> '4' 
-- ORDER BY
-- 	CASE
--     	WHEN u.gender = 'Female' THEN 0
--         WHEN u.gender = 'Other' THEN 1
--         WHEN u.gender IS NULL THEN 2
--         ELSE 3
--     END,
--     CASE
--     	WHEN u.orientation = 'Heterosexual' THEN 0
--         WHEN u.orientation = 'Bisexual' THEN 1
--         WHEN u.orientation IS NULL THEN 2
--         ELSE 3
--     END,
--     CASE
--     	WHEN l.latitude IS NOT NULL THEN ABS(l.latitude - 50.4447) + ABS(l.longitude - 30.5238)
--         ELSE 2
--     END
SELECT u.id, u.login, u.first_name, u.last_name, u.age, u.about, p.url AS avatar, ABS(l.latitude - 50.4447) + ABS(l.longitude - 30.5238) AS diff
    FROM users u
    LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = '1'
    LEFT JOIN locations l ON l.user_id = u.id
    WHERE u.id <> '4'
    AND u.active = '1'
    ORDER BY
        CASE
            WHEN u.gender = 'Male' THEN 0
            WHEN u.gender = 'Female' THEN 0
            WHEN u.gender = 'Other' THEN 0
            ELSE 42
        END,
        CASE
            WHEN u.orientation = 'Heterosexual' THEN 0
            WHEN u.orientation = 'Bisexual' THEN 0
            WHEN u.orientation = 'Homosexual' THEN 0
            WHEN u.orientation = 'Asexual' THEN 0
            WHEN u.orientation = 'Other' THEN 0
            ELSE 42
        END,
        CASE
            WHEN l.latitude IS NOT NULL THEN ABS(l.latitude - 0) + ABS(l.longitude - 0)
            ELSE 42
        END,
        CASE
            WHEN u.age IS NOT NULL THEN ABS(0 - CAST(u.age AS SIGNED))
            ELSE 42
        END