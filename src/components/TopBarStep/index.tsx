import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { View } from 'react-native';

interface ITopBarStepProps extends React.ClassAttributes<ITopBarStepProps>, WithTranslation {
  step: number;
}

class TopBarStep extends React.Component<ITopBarStepProps> {
  constructor(props: ITopBarStepProps) {
    super(props);
  }

  render() {
    const thirdStep = (
      <Svg width="212" height="44" viewBox="0 0 212 44" fill="none">
        <Rect x="21" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M26 21.5714L29.6364 25L36 19" stroke="white" stroke-width="2" />
        <Rect x="44" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="71" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M76 21.5714L79.6364 25L86 19" stroke="white" stroke-width="2" />
        <Rect x="94" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="121" y="12" width="20" height="20" rx="10" fill="white" />
        <Path
          d="M131.035 26.1582C132.828 26.1582 134.1 25.1152 134.1 23.6621V23.6504C134.1 22.4668 133.268 21.7168 132.025 21.6055V21.5762C133.057 21.3594 133.807 20.6562 133.807 19.6074V19.5957C133.807 18.2891 132.705 17.3867 131.023 17.3867C129.371 17.3867 128.246 18.3301 128.117 19.7539L128.111 19.8184H129.342L129.348 19.7598C129.43 18.9629 130.086 18.4648 131.023 18.4648C131.979 18.4648 132.529 18.9453 132.529 19.7656V19.7773C132.529 20.5625 131.873 21.1309 130.906 21.1309H129.916V22.1504H130.947C132.072 22.1504 132.764 22.6836 132.764 23.6387V23.6504C132.764 24.4824 132.066 25.0625 131.035 25.0625C129.986 25.0625 129.277 24.5234 129.195 23.7559L129.189 23.6973H127.936L127.941 23.7676C128.053 25.168 129.23 26.1582 131.035 26.1582Z"
          fill="#3A81CD"
        />
        <Rect x="144" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="171" y="12" width="20" height="20" rx="10" fill="#185392" />
        <Path
          d="M181.838 26H183.104V24.3184H184.27V23.2051H183.104V17.5449H181.234C180.068 19.2969 178.826 21.2949 177.713 23.2051V24.3184H181.838V26ZM178.973 23.2285V23.1465C179.84 21.6641 180.871 20.0176 181.779 18.6523H181.855V23.2285H178.973Z"
          fill="#3A81CD"
        />
      </Svg>
    );
    const firstStep = (
      <Svg width="212" height="44" viewBox="0 0 212 44" fill="none">
        <Rect x="21" y="12" width="20" height="20" rx="10" fill="white" />
        <Path
          d="M31.0938 26H32.4062V17.5449H31.0938L28.8672 19.127V20.416L30.9941 18.8984H31.0938V26Z"
          fill="#2569B0"
        />
        <Rect x="44" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="71" y="12" width="20" height="20" rx="10" fill="#185392" />
        <Path
          d="M78.2051 26H83.9004V24.8809H79.9922V24.7637L81.7852 22.9766C83.3203 21.4531 83.7656 20.7148 83.7656 19.7539V19.7363C83.7656 18.3418 82.6055 17.3398 81.0293 17.3398C79.3301 17.3398 78.1348 18.4297 78.1289 19.9766L78.1406 19.9883H79.3711L79.377 19.9707C79.377 19.0449 80.0098 18.4238 80.959 18.4238C81.8848 18.4238 82.4531 19.0332 82.4531 19.8594V19.877C82.4531 20.5625 82.1309 20.9961 81.0117 22.1621L78.2051 25.1094V26Z"
          fill="#3A81CD"
        />
        <Rect x="94" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="121" y="12" width="20" height="20" rx="10" fill="#185392" />
        <Path
          d="M131.035 26.1582C132.828 26.1582 134.1 25.1152 134.1 23.6621V23.6504C134.1 22.4668 133.268 21.7168 132.025 21.6055V21.5762C133.057 21.3594 133.807 20.6562 133.807 19.6074V19.5957C133.807 18.2891 132.705 17.3867 131.023 17.3867C129.371 17.3867 128.246 18.3301 128.117 19.7539L128.111 19.8184H129.342L129.348 19.7598C129.43 18.9629 130.086 18.4648 131.023 18.4648C131.979 18.4648 132.529 18.9453 132.529 19.7656V19.7773C132.529 20.5625 131.873 21.1309 130.906 21.1309H129.916V22.1504H130.947C132.072 22.1504 132.764 22.6836 132.764 23.6387V23.6504C132.764 24.4824 132.066 25.0625 131.035 25.0625C129.986 25.0625 129.277 24.5234 129.195 23.7559L129.189 23.6973H127.936L127.941 23.7676C128.053 25.168 129.23 26.1582 131.035 26.1582Z"
          fill="#3A81CD"
        />
        <Rect x="144" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="171" y="12" width="20" height="20" rx="10" fill="#185392" />
        <Path
          d="M181.838 26H183.104V24.3184H184.27V23.2051H183.104V17.5449H181.234C180.068 19.2969 178.826 21.2949 177.713 23.2051V24.3184H181.838V26ZM178.973 23.2285V23.1465C179.84 21.6641 180.871 20.0176 181.779 18.6523H181.855V23.2285H178.973Z"
          fill="#3A81CD"
        />
      </Svg>
    );
    const done = (
      <Svg width="212" height="44" viewBox="0 0 212 44" fill="none">
        <Rect x="21" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M26 21.5714L29.6364 25L36 19" stroke="white" stroke-width="2" />
        <Rect x="44" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="71" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M76 21.5714L79.6364 25L86 19" stroke="white" stroke-width="2" />
        <Rect x="94" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="121" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M126 21.5714L129.636 25L136 19" stroke="white" stroke-width="2" />
        <Rect x="144" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="171" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M176 21.5714L179.636 25L186 19" stroke="white" stroke-width="2" />
      </Svg>
    );
    const fourthStep = (
      <Svg width="212" height="44" viewBox="0 0 212 44" fill="none">
        <Rect x="21" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M26 21.5714L29.6364 25L36 19" stroke="white" stroke-width="2" />
        <Rect x="44" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="71" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M76 21.5714L79.6364 25L86 19" stroke="white" stroke-width="2" />
        <Rect x="94" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="121" y="12" width="20" height="20" rx="10" fill="#27AE60" />
        <Path d="M126 21.5714L129.636 25L136 19" stroke="white" stroke-width="2" />
        <Rect x="144" y="21" width="24" height="2" rx="1" fill="#185392" />
        <Rect x="171" y="12" width="20" height="20" rx="10" fill="white" />
        <Path
          d="M181.838 26H183.104V24.3184H184.27V23.2051H183.104V17.5449H181.234C180.068 19.2969 178.826 21.2949 177.713 23.2051V24.3184H181.838V26ZM178.973 23.2285V23.1465C179.84 21.6641 180.871 20.0176 181.779 18.6523H181.855V23.2285H178.973Z"
          fill="#3A81CD"
        />
      </Svg>
    );
    const secondStep = (
      <Svg width={212} height={44} viewBox="0 0 212 44" fill="none">
        <Rect x={21} y={12} width={20} height={20} rx={10} fill="#27AE60" />
        <Path d="M26 21.571L29.636 25 36 19" stroke="#fff" strokeWidth={2} />
        <Rect x={44} y={21} width={24} height={2} rx={1} fill="#185392" />
        <Rect x={71} y={12} width={20} height={20} rx={10} fill="#fff" />
        <Path
          d="M78.205 26H83.9v-1.12h-3.908v-.116l1.793-1.787c1.535-1.524 1.98-2.262 1.98-3.223v-.018c0-1.394-1.16-2.396-2.736-2.396-1.699 0-2.894 1.09-2.9 2.637l.012.011h1.23l.006-.017c0-.926.633-1.547 1.582-1.547.926 0 1.494.61 1.494 1.435v.018c0 .686-.322 1.12-1.441 2.285l-2.807 2.947V26z"
          fill="#3A81CD"
        />
        <Rect x={94} y={21} width={24} height={2} rx={1} fill="#185392" />
        <Rect x={121} y={12} width={20} height={20} rx={10} fill="#185392" />
        <Path
          d="M131.035 26.158c1.793 0 3.065-1.043 3.065-2.496v-.012c0-1.183-.832-1.933-2.075-2.044v-.03c1.032-.217 1.782-.92 1.782-1.969v-.011c0-1.307-1.102-2.21-2.784-2.21-1.652 0-2.777.944-2.906 2.368l-.006.064h1.231l.006-.058c.082-.797.738-1.295 1.675-1.295.956 0 1.506.48 1.506 1.3v.012c0 .785-.656 1.354-1.623 1.354h-.99v1.02h1.031c1.125 0 1.817.533 1.817 1.488v.011c0 .832-.698 1.413-1.729 1.413-1.049 0-1.758-.54-1.84-1.307l-.006-.059h-1.253l.005.07c.112 1.401 1.289 2.391 3.094 2.391z"
          fill="#3A81CD"
        />
        <Rect x={144} y={21} width={24} height={2} rx={1} fill="#185392" />
        <Rect x={171} y={12} width={20} height={20} rx={10} fill="#185392" />
        <Path
          d="M181.838 26h1.266v-1.682h1.166v-1.113h-1.166v-5.66h-1.87a115.216 115.216 0 00-3.521 5.66v1.113h4.125V26zm-2.865-2.771v-.082a96.676 96.676 0 012.806-4.495h.076v4.576h-2.882z"
          fill="#3A81CD"
        />
      </Svg>
    );

    switch (this.props.step) {
      case 1:
        return firstStep;
      case 2:
        return secondStep;
      case 3:
        return thirdStep;
      case 4:
        return fourthStep;
      case 5:
        return done;
      default:
        return <View />;
    }
  }
}

export default withErrorBoundary(withTranslation()(TopBarStep), Fallback, handleError);
