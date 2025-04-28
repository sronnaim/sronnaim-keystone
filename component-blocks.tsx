import React from "react";
import {
  component,
  NotEditable,
  fields,
} from "@keystone-6/fields-document/component-blocks";

export const componentBlocks = {
  image: component({
    preview: (props) => {
      const url = props.fields.url.value;
      const alt = props.fields.alt.value;
      const caption = props.fields.caption.value;

      return (
        <NotEditable>
          <figure
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <img
              src={url}
              style={{
                maxHeight: "300px",
                maxWidth: "100%",
                borderRadius: "16px",
              }}
              alt={alt}
            />
            <figcaption>{caption}</figcaption>
          </figure>
        </NotEditable>
      );
    },
    label: "Image",
    schema: {
      url: fields.url({
        label: "URL",
        defaultValue:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      }),
      alt: fields.text({
        label: "Alt Text",
      }),
      caption: fields.text({
        label: "Caption",
        defaultValue: "",
      }),
    },
  }),
};
