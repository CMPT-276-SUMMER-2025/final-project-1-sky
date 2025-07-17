import {Accordion, AccordionItem} from "@heroui/react";

export default function FAQ() {
  return (
    <Accordion>
      <AccordionItem key="1" aria-label="Question A" title="Question A">
        Hi testing testing
      </AccordionItem>
      <AccordionItem key="2" aria-label="Question B" title="Question B">
        Hi testing testing
      </AccordionItem>
      <AccordionItem key="3" aria-label="Question C" title="Question C">
        Hi testing testing
      </AccordionItem>
    </Accordion>
  );
}
