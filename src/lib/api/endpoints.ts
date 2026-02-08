
/* ================= AUth ================= */
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESEND_OTP: "/api/auth/resend-otp",
};

/* ================= User ================= */
export const USER_ENDPOINTS = {
  PROFILE: "/api/profile",

  PROFILE_VISIT: (userId: string) => `/api/profile/${userId}`,

  CHECK_USERNAME: (username: string) =>
    `/api/users/check/${encodeURIComponent(username)}`,

  USER_BY_ID: (id: string) =>
    `/api/users/${encodeURIComponent(id)}`,

  STARTUP_DETAILS: (id: string) =>
    `/api/startup-details/${encodeURIComponent(id)}`,

  STARTUP_DETAILS_BY_ID: (id: string) =>
    `/api/startup-details/by-id/${encodeURIComponent(id)}`,

  UPLOAD: "/api/upload",

  FOLLOW: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}`,

  FOLLOW_CHECK: (id: string) =>
    `/api/follows/check/${encodeURIComponent(id)}`,

  FOLLOWERS: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}/followers`,

  FOLLOWING: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}/following`,

  SEARCH_USERS: "/api/search/users",
};


/* ================= POSTS ================= */

export const POST_ENDPOINTS = {
  MY_POSTS: "/api/posts/me",
  POSTS: "/api/posts",
  POST_BY_ID: (postId: string) =>
    `/api/posts/${encodeURIComponent(postId)}`,
};


/* ================= LIKES ================= */

export const LIKE_ENDPOINTS = {
  POST_LIKES: (postId: string) =>
    `/api/likes/post/${encodeURIComponent(postId)}`,
};


/* ================= COMMENTS ================= */

export const COMMENT_ENDPOINTS = {
  COMMENTS: (postId: string) =>
    `/api/comments/${encodeURIComponent(postId)}/comments`,

  DELETE_COMMENT: (commentId: string) =>
    `/api/comments/${encodeURIComponent(commentId)}`,

  REPLIES: (commentId: string) =>
    `/api/comments/${encodeURIComponent(commentId)}/replies`,
};


/* ================= CROWNS ================= */

export const CROWN_ENDPOINTS = {
  POST_CROWNS: (postId: string) =>
    `/api/crowns/post/${encodeURIComponent(postId)}`,
};


/* ================= SHARES ================= */

export const SHARE_ENDPOINTS = {
  SHARES: "/api/shares",
  CHECK_SHARE: (postId: string) =>
    `/api/shares/check/${encodeURIComponent(postId)}`,
};


/* ================= SAVED POSTS ================= */

export const SAVED_ENDPOINTS = {
  SAVED: "/api/saved",
  DELETE_SAVED: (savedId: string) =>
    `/api/saved/${encodeURIComponent(savedId)}`,
};
