import { useTranslation } from "react-i18next";
import EventCard from "./EventCard";

const EventList = ({ events, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <p className="text-center">{t("events.loading")}</p>;
  }

  if (!events || events.length === 0) {
    return <div className="alert alert-warning">{t("events.noEvents")}</div>;
  }

  return (
    <div className="grid grid-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
