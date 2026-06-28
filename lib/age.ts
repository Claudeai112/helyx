// Name of the cookie that records a visitor confirmed they are 21 or older.
// Kept in its own module so both the server action and the root layout can
// import it (a "use server" file may only export async functions).
export const AGE_COOKIE = "helyx_age_verified";

// One year, in seconds.
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
