import React from "react"

//Friend c'est un type et c'est comme une structure en C
interface Friend {
    pseudo: string,
    status: string,
}

const Friends = () => {
	const friends: Friend[] = [
		{
			pseudo: "Guillaumedu77",
			status: "En ligne",
			// avatar: imgGuillaume
		},
		{
			pseudo: "Leodu69",
			status: "Hors ligne",
			// avatar: imgLeo,
		},
		{
			pseudo: "Manondu62",
			status: "Hors ligne",
			// avatar: imgManon
		},
		{
			pseudo: "AlanTiaCapté",
			status: "En pleine partie",
			// avatar: imgAlan
		},
	  ]

	  const printFriends = () => {
		const res: JSX.Element[] = friends.map((friend: Friend) => {
			console.log("friend = ", friend);
			return (
				<p>{friend.pseudo} est {friend.status}</p>
			)
		  })
		  console.log("res = ", res);
		  return res;
	  }

	return (
		<div>
			{printFriends()}
		</div>
	)
}

export default Friends