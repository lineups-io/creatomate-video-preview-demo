import React, { Fragment, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Preview, PreviewState } from '@creatomate/preview';
import { deepClone } from '../utility/deepClone';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';
import { ImageOption } from './ImageOption';
import { Button } from './Button';

interface SettingsPanelProps {
  preview: Preview;
  currentState?: PreviewState;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // In this variable, we store the modifications that are applied to the template
  // Refer to: https://creatomate.com/docs/api/rest-api/the-modifications-object
  const modificationsRef = useRef<Record<string, any>>({});

  // Get the slide elements in the template by name (starting with 'Slide-')
  const slideElements = useMemo(() => {
    return props.currentState?.elements.filter((element) => element.source.name?.startsWith('Slide-'));
  }, [props.currentState]);

  return (
    <div>
      <Group>
        <GroupTitle>Intro</GroupTitle>
        <TextInput
          placeholder="Lorem ipsum dolor sit amet"
          onFocus={() => ensureElementVisibility(props.preview, 'Title', 1.5)}
          onChange={(e) => setPropertyValue(props.preview, 'Title', e.target.value, modificationsRef.current)}
        />
        <TextInput
          placeholder="Enter your tagline here"
          onFocus={() => ensureElementVisibility(props.preview, 'Tagline', 1.5)}
          onChange={(e) => setPropertyValue(props.preview, 'Tagline', e.target.value, modificationsRef.current)}
        />
        <TextInput
          placeholder="A second and longer text here ✌️"
          onFocus={() => ensureElementVisibility(props.preview, 'Start-Text', 1.5)}
          onChange={(e) => setPropertyValue(props.preview, 'Start-Text', e.target.value, modificationsRef.current)}
        />
      </Group>

      <Group>
        <GroupTitle>Outro</GroupTitle>
        <TextInput
          placeholder="Your Call To Action Here"
          onFocus={() => ensureElementVisibility(props.preview, 'Final-Text', 1.5)}
          onChange={(e) => setPropertyValue(props.preview, 'Final-Text', e.target.value, modificationsRef.current)}
        />
      </Group>

      {slideElements?.map((slideElement, i) => {
        const transitionAnimation = slideElement.source.animations.find((animation: any) => animation.transition);

        const nestedElements = props.preview.getElements(slideElement);
        const textElement = nestedElements.find((element) => element.source.name?.endsWith('-Text'));
        const imageElement = nestedElements.find((element) => element.source.name?.endsWith('-Image'));

        return (
          <Group key={i}>
            <GroupTitle>Slide {i + 1}</GroupTitle>
            {textElement && (
              <Fragment>
                <TextInput
                  placeholder={textElement.source.text}
                  onFocus={() => ensureElementVisibility(props.preview, textElement.source.name, 1.5)}
                  onChange={(e) =>
                    setPropertyValue(props.preview, textElement.source.name, e.target.value, modificationsRef.current)
                  }
                />
                <SelectInput
                  onFocus={() => ensureElementVisibility(props.preview, textElement.source.name, 1.5)}
                  onChange={(e) =>
                    setTextStyle(props.preview, textElement.source.name, e.target.value, modificationsRef.current)
                  }
                >
                  <option value="block-text">Block Text</option>
                  <option value="rounded-text">Rounded Text</option>
                </SelectInput>
                <SelectInput
                  value={transitionAnimation?.type}
                  onFocus={() => ensureElementVisibility(props.preview, slideElement.source.name, 0.5)}
                  onChange={(e) => setSlideTransition(props.preview, slideElement.source.name, e.target.value)}
                >
                  <option value="fade">Fade Transition</option>
                  <option value="circular-wipe">Circle Wipe Transition</option>
                </SelectInput>
                {imageElement && (
                  <ImageOptions>
                    {[
                      'https://creatomate-static.s3.amazonaws.com/demo/harshil-gudka-77zGnfU_SFU-unsplash.jpg',
                      'https://creatomate-static.s3.amazonaws.com/demo/samuel-ferrara-1527pjeb6jg-unsplash.jpg',
                      'https://creatomate-static.s3.amazonaws.com/demo/simon-berger-UqCnDyc_3vA-unsplash.jpg',
                    ].map((url) => (
                      <ImageOption
                        key={url}
                        url={url}
                        onClick={async () => {
                          await ensureElementVisibility(props.preview, imageElement.source.name, 1.5);
                          await setPropertyValue(
                            props.preview,
                            imageElement.source.name,
                            url,
                            modificationsRef.current,
                          );
                        }}
                      />
                    ))}
                  </ImageOptions>
                )}
              </Fragment>
            )}
          </Group>
        );
      })}
    </div>
  );
};

const Group = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: #f5f7f8;
  border-radius: 5px;
`;

const GroupTitle = styled.div`
  margin-bottom: 15px;
  font-weight: 600;
`;

const ImageOptions = styled.div`
  display: flex;
  margin: 20px -10px 0 -10px;
`;

// Updates the provided modifications object
const setPropertyValue = async (
  preview: Preview,
  selector: string,
  value: string,
  modifications: Record<string, any>,
) => {
  if (value.trim()) {
    // If a non-empty value is passed, update the modifications based on the provided selector
    modifications[selector] = value;
  } else {
    // If an empty value is passed, remove it from the modifications map, restoring its default
    delete modifications[selector];
  }

  // Set the template modifications
  await preview.setModifications(modifications);
};

// Sets the text styling properties
// For a full list of text properties, refer to: https://creatomate.com/docs/json/elements/text-element
const setTextStyle = async (preview: Preview, selector: string, style: string, modifications: Record<string, any>) => {
  if (style === 'block-text') {
    modifications[`${selector}.background_border_radius`] = '0%';
  } else if (style === 'rounded-text') {
    modifications[`${selector}.background_border_radius`] = '50%';
  }

  await preview.setModifications(modifications);
};

// Jumps to a time position where the provided element is visible
const ensureElementVisibility = async (preview: Preview, elementName: string, addTime: number) => {
  // Find element by name
  const element = preview.getElements().find((element) => element.source.name === elementName);
  if (element) {
    // Set playback time
    await preview.setTime(element.globalTime + addTime);
  }
};

// Sets the animation of a slide element
const setSlideTransition = async (preview: Preview, slideName: string, type: string) => {
  // Make sure to clone the state as it's immutable
  const mutatedState = deepClone(preview.state);

  // Find element by name
  const element = preview.getElements(mutatedState).find((element) => element.source.name === slideName);
  if (element) {
    // Set the animation property
    // Refer to: https://creatomate.com/docs/json/elements/common-properties
    element.source.animations = [
      {
        type,
        duration: 1,
        transition: true,
      },
    ];

    // Update the video source
    // Refer to: https://creatomate.com/docs/json/introduction
    await preview.setSource(preview.getSource(mutatedState));
  }
};
