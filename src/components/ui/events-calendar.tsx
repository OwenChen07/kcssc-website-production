import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Event } from "@/lib/data-service";
import { getEventsForDate } from "@/lib/data-service";

type EventsCalendarProps = React.ComponentProps<typeof DayPicker> & {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export function EventsCalendar({ 
  className, 
  classNames, 
  showOutsideDays = true,
  events,
  onEventClick,
  ...props 
}: EventsCalendarProps & { components?: never }) {
  const DayContent = React.useCallback((props: { date: Date }) => {
    const { date } = props;
    const dayEvents = getEventsForDate(events, date);
    const hasEvents = dayEvents.length > 0;

    return (
      <div className="w-full h-full flex flex-col items-start p-3 overflow-hidden">
        <span className="text-base font-semibold mb-2">{date.getDate()}</span>
        {hasEvents && (
          <div className="flex flex-col gap-1.5 w-full mt-1 flex-grow overflow-y-auto overflow-x-hidden">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "text-xs px-2 py-1.5 rounded cursor-pointer w-full hover:opacity-80 transition-opacity",
                  event.featured 
                    ? "bg-accent text-accent-foreground font-semibold" 
                    : "bg-primary/20 text-primary"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
                title={`${event.title} - ${event.time}`}
              >
                <div className="font-semibold break-words leading-tight whitespace-normal">{event.title}</div>
                <div className="text-[10px] opacity-90 mt-0.5 whitespace-normal">{event.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [events, onEventClick]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-8 w-full", className)}
      classNames={{
        months: "flex flex-col w-full",
        month: "space-y-6 w-full",
        caption: "flex justify-center pt-1 relative items-center mb-6",
        caption_label: "text-2xl font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse table-fixed",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground rounded-md w-[14.28%] font-normal text-base py-4 text-center font-semibold",
        row: "flex w-full border-b border-border/50",
        cell: "w-[14.28%] text-center text-sm p-0 relative h-[200px] border-r border-border/50 last:border-r-0 overflow-hidden",
        day: cn(buttonVariants({ variant: "ghost" }), "h-[200px] w-full p-0 font-normal flex flex-col items-start text-left hover:bg-accent/50 overflow-hidden"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent/50 text-accent-foreground font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: DayContent,
      }}
      modifiers={{
        hasEvents: (date: Date) => getEventsForDate(events, date).length > 0,
      }}
      modifiersStyles={{
        hasEvents: {
          backgroundColor: 'hsl(var(--primary) / 0.1)',
        },
      }}
      {...props}
    />
  );
}

