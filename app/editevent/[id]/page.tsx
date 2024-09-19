import EditEvent from "../../components/EditEvent/EditEvent";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditEvent event_id={Number(params.id)} />;
}
