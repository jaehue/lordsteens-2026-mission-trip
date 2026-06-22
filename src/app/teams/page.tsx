import ScreenHeader from "@/components/ScreenHeader";
import TeamsView from "@/components/TeamsView";
import { getTeams, teamChips } from "@/lib/dashboard";

export default function TeamsPage() {
  const teams = getTeams();
  return (
    <>
      <ScreenHeader title="팀별 현황" />
      <TeamsView teams={teams} chips={teamChips(teams)} />
    </>
  );
}
