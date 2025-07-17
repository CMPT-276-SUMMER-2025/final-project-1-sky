import {Accordion, AccordionItem} from "@heroui/react";

export default function FAQ() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

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
