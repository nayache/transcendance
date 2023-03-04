
import "../styles/DMUserProfile.css"
// import avatar from "../avatar2.jpeg"
// import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DMUserProfile = () => {
	
	// toggleInfo = (e: any) => {
	// 	e.target.parentNode.classList.toggle("open");
	// };

	return (
		<div className="main__userprofile">
		<div className="profile__card user__profile__image">
			<div className="profile__image">
				{/* <img src={avatar} /> */}
			</div>
			<h4>manonlaplusbelle</h4>
			<p>Frappe atomique & plein d'autre qualité</p>
		</div>
		<div className="profile__card">
			<div className="card__header" /*{onClick={this.toggleInfo}}*/>
				<h4>Information</h4>
				{/* <FontAwesomeIcon className="faaAngleDown" icon={faAngleDown}/> */}
			</div>
			<div className="card__content">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
					ultrices urna a imperdiet egestas. Donec in magna quis ligula
				</p>
			</div>
		</div>
		</div>
	);
}

export default DMUserProfile