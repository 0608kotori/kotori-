import styles from "./ResearchStepper.module.css";

export interface ResearchStep {
  id: string;
  label: string;
  labelZh: string;
  title: string;
  titleZh: string;
  copy: string;
  copyZh: string;
}

interface ResearchStepperProps {
  steps: readonly ResearchStep[];
  currentStep?: number;
  className?: string;
}

const stateLabels = {
  complete: "COMPLETE",
  current: "CURRENT",
  upcoming: "NEXT",
} as const;

/**
 * A read-only, dependency-free adaptation of the React Bits Stepper pattern.
 * Every stage remains visible and the current state is exposed semantically.
 */
export default function ResearchStepper({
  steps,
  currentStep = 1,
  className = "",
}: ResearchStepperProps) {
  const normalizedCurrentStep = Math.min(
    Math.max(currentStep, 1),
    steps.length + 1,
  );

  return (
    <ol
      className={`${styles.stepper} ${className}`.trim()}
      aria-label="未来项目研究阶段"
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const state =
          stepNumber < normalizedCurrentStep
            ? "complete"
            : stepNumber === normalizedCurrentStep
              ? "current"
              : "upcoming";

        return (
          <li
            key={step.id}
            className={styles.step}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.marker}>
                {state === "complete" ? (
                  <span className={styles.checkMark}>✓</span>
                ) : state === "current" ? (
                  <span className={styles.activeDot} />
                ) : (
                  <span className={styles.stepNumber}>
                    {stepNumber.toString().padStart(2, "0")}
                  </span>
                )}
              </span>
              {index < steps.length - 1 ? (
                <span className={styles.connector}>
                  <span className={styles.connectorFill} />
                </span>
              ) : null}
            </div>

            <article className={styles.content}>
              <div className={styles.meta}>
                <p className={styles.label}>
                  {step.labelZh}
                  <span>{step.label}</span>
                </p>
                <span className={styles.stateLabel}>{stateLabels[state]}</span>
              </div>
              <h4>{step.titleZh}</h4>
              <p className={styles.titleZh} lang="en">
                {step.title}
              </p>
              <p>{step.copyZh}</p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
