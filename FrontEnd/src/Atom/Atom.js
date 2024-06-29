import { atom } from "recoil";
export const Auth = atom({
  key: "Auth",
  default: {
    name: null,

    status: false,
  },
});

export const post = atom({
  key: "post",
  default: 1,
});

export const Posts = atom({
  key: "posts",
  default: [],
});

export const categoryPostState = atom({
  key: "categoryPostState",
  default: { status: false, category: "" },
});
export const Count=atom({
    key:"Count",
    default:0
})
export const deletePost=atom({
  key:"deletePost",
  default:true
})

export const jsonwebtoken=atom({
  key:"jsonwebtoken",
  default:localStorage.getItem("jwt")
})

export const Load=atom({
  key:"Load",
  default:false
})
export const Redirect=atom({
  key:"Redirect",
  default:"/"
})

export const EditPost=atom({
  key:"EditPost",
  default:-1
})