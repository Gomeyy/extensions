import { List, Icon, ActionPanel, SubmitFormAction, showToast, ToastStyle, PushAction, Color} from "@raycast/api";
import dayjs from "dayjs";
import { TimeEntry } from "../toggl/types";
import useCurrentTime from "../hooks/useCurrentTime";
import { storage } from "../storage";
import toggl from "../toggl";
import { AppContextProvider, useAppContext } from "../context";
import TimeEntryForm from "./TimeEntryForm";

function RunningTimeEntry({ runningTimeEntry }: { runningTimeEntry: TimeEntry }) {
  const currentTime = useCurrentTime();
  const { projects } = useAppContext();
  const getProjectById = (id: number) => projects.find((p) => p.id === id);

  const stopTimeEntry = async () => {
    await showToast(ToastStyle.Animated, "Stopping time entry...");
    try {
      await toggl.stopTimeEntry({ id: runningTimeEntry.id });
      await storage.runningTimeEntry.refresh();
      await storage.timeEntries.refresh();
      await showToast(ToastStyle.Success, `Stopped time entry`);
    } catch (e) {
      await showToast(ToastStyle.Failure, "Failed to stop time entry");
    }
  };

  const deleteTimeEntry = async () => {
    await showToast(ToastStyle.Animated, "Deleting time entry...");
    try {
      await toggl.deleteTimeEntry({id: runningTimeEntry.id });
      await storage.runningTimeEntry.refresh();
      await storage.timeEntries.refresh();
      await showToast(ToastStyle.Success, "Time entry deleted");
    } catch (e) {
      await showToast(ToastStyle.Failure, "Failed to delete time entry");
    }
}

  return (
    <List.Section title="Running time entry" key="running-time-entry">
      <List.Item
        title={runningTimeEntry.description || "No description"}
        subtitle={dayjs.duration(dayjs(currentTime).diff(runningTimeEntry.start), "milliseconds").format("HH:mm:ss")}
        accessoryTitle={getProjectById(runningTimeEntry?.pid)?.name}
        accessoryIcon={{ source: Icon.Dot, tintColor: getProjectById(runningTimeEntry?.pid)?.hex_color }}
        icon={{ source: Icon.Clock, tintColor: getProjectById(runningTimeEntry?.pid)?.hex_color }}
        actions={
          <ActionPanel>
            <SubmitFormAction icon={{ source: Icon.Clock }} onSubmit={stopTimeEntry} title="Stop Time Entry" />
            <PushAction
              title="Edit Time Entry"
              icon={{ source: Icon.Clock }}
              target={
                <AppContextProvider>
                  <TimeEntryForm entry={runningTimeEntry}/>
                </AppContextProvider>
              }
            />
            <ActionPanel.Item
              title="Delete Time Entry"
              onAction={() => deleteTimeEntry()}
              icon={{ source: Icon.Trash , tintColor: Color.Red}}
              shortcut={{ modifiers: ["cmd"], key: "t" }}
            />
          </ActionPanel>
        }
      />
    </List.Section>
  );
}

export default RunningTimeEntry;
