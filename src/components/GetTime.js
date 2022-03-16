import { useEffect, useState } from "react";

const GetTime = ({ timezone }) => {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div className="datetime">
      <div className="date">
        {new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          weekday: "long",
          month: "long",
          day: "2-digit",
        }).format(dateState)}
      </div>
      <div className="time">
        {new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(dateState)}
      </div>
    </div>
  );
};

export default GetTime;
