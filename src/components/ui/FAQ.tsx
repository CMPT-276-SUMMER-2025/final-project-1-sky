import {Accordion, AccordionItem} from "@heroui/react";

export default function FAQ() {
  return (
    <Accordion variant = "splitted" className="space-y-0.5 text-slate-700">
      <AccordionItem key="1" aria-label="Why can I not find my city?" title="Why can I not find my city?">
        <p className="text-slate-600">
        Currently we only support 50 cities in Canada. If you cannot find your city, it may not be supported yet. We are continuously working to expand our coverage, so please check back later or consider using a nearby city for air quality information.
        </p>
      </AccordionItem>
      <AccordionItem key="2" aria-label="What is AQHI shown on the information page?" title="What is AQHI shown on the information page?">
        <p className="text-slate-600">
        AQHI stands for Air Quality Health Index. It is a tool used to communicate the level of air pollution and its potential health effects on the general public. The AQHI is calculated based on the concentrations of various air pollutants, including ground-level ozone, particulate matter, and nitrogen dioxide. It provides a scale that indicates the level of health risk associated with current air quality conditions.
        </p>
      </AccordionItem>
    </Accordion>
  );
}
