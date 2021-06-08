import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { UpdateConnections, updateConnections } from "../../../features/profile/profileSlice";
import { Connection, UserActivity, UserProfile, ViewProfileData } from "../../../features/profile/profileSlice.types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { unwrapResult } from "@reduxjs/toolkit";

type Post = {
    _id:string;
    file:string;
}

type ProfileSectionProps = {
    profile:UserProfile;
    posts:Post[];
    connections:Connection;
    activities:UserActivity;
    setData:Dispatch<SetStateAction<ViewProfileData|undefined>>;
    isYouFollowingUser:string|undefined;
}

const ProfileSection = ({profile,posts,isYouFollowingUser,activities,connections,setData}:ProfileSectionProps) => {

    const userId = useAppSelector(state => state.auth.user?._id);
    const token = useAppSelector(state => state.auth.token);
    const isUserFollowingYou = connections.following.find( uid => uid === userId );
    const isRequested = activities.requests.find( uid => uid === userId)
    const dispatch = useAppDispatch();

    const handleConnections = () => {
        dispatch(updateConnections({token,userId:profile._id}))
        .then(unwrapResult).then( originalPromiseResult => {
            setData(state => {
                if(state){
                    return ({...state,connections:originalPromiseResult.userconnections,activities:originalPromiseResult.activities})
                }
            })
            dispatch(UpdateConnections({connections:originalPromiseResult.yourconnections}))
        })
    }
        
    return (
        <div className="profile__section">
               <img className="profile__avatar" alt="profile" src={profile.pic}/>
               <span className="username__mobile">{profile.username}</span>
               <div className="profile__details">
                   <div className="section__1">
                       <span className="username__desktop">{profile.username}</span>
                       <div className="profile__btn__container">

                          { isYouFollowingUser && <button className="secondary__btn" onClick={handleConnections}>Following</button>}
                          { !isYouFollowingUser && isRequested && <button className="secondary__btn" onClick={handleConnections}>Requested</button> }
                          { !isYouFollowingUser && isUserFollowingYou  && !isRequested && <button className="primary__btn" onClick={handleConnections}>Follow back</button> }
                          { !isYouFollowingUser && !isUserFollowingYou && !isRequested && <button className="primary__btn" onClick={handleConnections}>Follow</button> }
                        
                          <button className="secondary__btn">Message</button>
                       </div>
                   </div>
                   <div className="section__2">
                       <div><span>{posts.length}</span> posts</div>
                       <Link to={ isYouFollowingUser || !profile.private ? `/followers/${profile._id}` : ""} className="nav__link"><span>{connections?.followers.length}</span> followers</Link>
                       <Link to={ isYouFollowingUser || !profile.private ? `/following/${profile._id}` : ""} className="nav__link"><span>{connections?.following.length}</span> following</Link>
                   </div>
                   <div className="section__3">
                       <div className="fullname">{profile.fullname}</div>
                       <p className="bio">{profile.bio}</p>
                       <a href={profile.website} rel="noreferrer" target="_blank" className="website__link">{profile.website}</a>
                   </div>
               </div>
            </div>
    );
};

export default ProfileSection;