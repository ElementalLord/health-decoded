import {
  caregiverLandingContent,
  type CaregiverReturningStateData,
} from "../../content/caregiver-landing";
import styles from "../../styles/caregiver-landing.module.css";

export interface CaregiverReturningStateProps {
  readonly progress: CaregiverReturningStateData;
}

export function CaregiverReturningState({ progress }: CaregiverReturningStateProps) {
  const { returning } = caregiverLandingContent;
  const resumeCopy = `You stopped in ${progress.recentModuleTitle} at ${progress.recentSectionTitle}.`;
  const nextCopy = `${progress.nextModuleTitle} is the next recommended module. You can open another module instead.`;
  const primaryAction = returning.primaryActionTemplate.replace(
    "[MODULE_TITLE]",
    progress.recentModuleTitle,
  );

  return (
    <section className={styles.returningState} aria-labelledby="caregiver-returning-title">
      <h2 id="caregiver-returning-title">{returning.greeting}</h2>
      <dl>
        <div>
          <dt>{returning.recentModuleLabel}</dt>
          <dd>{resumeCopy}</dd>
          <dd className={styles.unavailableAction}>{primaryAction}</dd>
        </div>
        <div>
          <dt>{returning.nextRecommendationLabel}</dt>
          <dd>{nextCopy}</dd>
        </div>
        {progress.recentToolName ? (
          <div>
            <dt>{returning.toolShortcutLabel}</dt>
            <dd>{progress.recentToolName}</dd>
          </div>
        ) : null}
      </dl>
      <p>{returning.privateProgress}</p>
    </section>
  );
}
