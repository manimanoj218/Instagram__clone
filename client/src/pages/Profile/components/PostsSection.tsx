import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

const PostsSection = () => {
    const posts = useAppSelector(state => state.profile.userposts);
    
    return (
        <div className="posts__section">
             <div className="section__1">
                 <button className="post__btn">
                    <svg aria-label="Posts" fill="#262626" height="12" viewBox="0 0 48 48" width="12"><path clipRule="evenodd" d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z" fillRule="evenodd"></path></svg>
                    {" "}POSTS
                 </button>
                 <button className="saved__btn">
                    <svg aria-label="Saved" fill="#262626" height="12" viewBox="0 0 48 48" width="12"><path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path></svg>
                    {" "}SAVED
                 </button>
             </div>
             <div className="section__2">
                 {
                    posts.map( post => {
                       const extension = post.file.split(".").pop();
                       const isImg = extension?.split('.').pop() === "jpg" || extension?.split('.').pop() === "png" || extension?.split('.').pop() === "jpeg";
                       const isVideo = extension?.split('.').pop() === "mp3" || extension?.split('.').pop() === "mp4";
                       return(
                        <Link to="/profile" key={post._id}>
                          { isImg && <img width="100%" alt="post" height="auto" src={post.file}/>}
                          { isVideo && <ReactPlayer url={post.file} width="100%" height="100%"/>}
                       </Link>
                       )
                    })
                 }
                
             </div>
        </div>
    )
}

export default PostsSection
