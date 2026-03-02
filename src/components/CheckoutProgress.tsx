import { Check, Truck, CreditCard, ClipboardCheck } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { label: "Shipping", icon: Truck },
  { label: "Payment", icon: CreditCard },
  { label: "Review", icon: ClipboardCheck },
];

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const Icon = isCompleted ? Check : step.icon;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold luxury-transition ${
                  isCompleted
                    ? "bg-success text-success-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${isCompleted ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutProgress;
