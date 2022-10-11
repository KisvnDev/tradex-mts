import React from 'react';
import { Platform } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { WebView } from 'react-native-webview';
import Fallback from 'components/Fallback';
import { IHighChart } from 'interfaces/common';
import { flattenObject, handleError } from 'utils/common';
import globalStyles from 'styles';

interface IMiniHighChartProps extends React.ClassAttributes<MiniHighchart>, IHighChart {}

interface IMiniHighChartState {
  init: string;
  end: string;
}

class MiniHighchart extends React.Component<IMiniHighChartProps, IMiniHighChartState> {
  constructor(props: IMiniHighChartProps) {
    super(props);

    this.state = {
      init: `<html>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
                    <style media="screen" type="text/css">
                    #container {
                        width:100%;
                        height:100%;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        position:absolute;
                        user-select: none;
                        -webkit-user-select: none;
                    }
                    </style>
                    <head>
                        ${
                          this.props.stock
                            ? Platform.OS === 'android'
                              ? '<script src="file:///android_asset/js/highChart/highstock.js"></script>'
                              : '<script src="https://code.highcharts.com/stock/highstock.js"></script>'
                            : Platform.OS === 'android'
                            ? '<script src="file:///android_asset/js/highChart/highcharts.js"></script>'
                            : '<script src="https://code.highcharts.com/highcharts.js'
                        }

                        ${
                          this.props.more
                            ? Platform.OS === 'android'
                              ? '<script src="file:///android_asset/js/highChart/highcharts-more.js"></script>'
                              : '<script src="https://code.highcharts.com/highcharts-more.js"></script>'
                            : ''
                        }
                        ${
                          this.props.gauge
                            ? Platform.OS === 'android'
                              ? '<script src="file:///android_asset/js/highChart/solid-gauge.js"></script>'
                              : '<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>'
                            : ''
                        }
                        
                        ${
                          Platform.OS === 'android'
                            ? '<script src="file:///android_asset/js/highChart/highCharts-theme.js"></script>'
                            : '<script src="https://s3-ap-southeast-1.amazonaws.com/tradex-vn/highCharts-theme.js"></script>'
                        }
                        ${
                          Platform.OS === 'android'
                            ? '<script src="file:///android_asset/js/highChart/highCharts-extra.js"></script>'
                            : '<script src="https://s3-ap-southeast-1.amazonaws.com/tradex-vn/highCharts-extra.js"></script>'
                        }
                        <script>
                        document.addEventListener("DOMContentLoaded", function(event) {

                            // Apply the theme
                            Highcharts.setOptions(Highcharts.theme);
                            Highcharts.setOptions(${JSON.stringify(this.props.options)});
                            var chart = Highcharts.${this.props.stock ? 'stockChart' : 'chart'}('container', `,
      end: `);
                            
                        });
                        </script>
                    </head>
                    <body>
                        <div id="container">
                        </div>
                    </body>
                </html>`,
    };
  }

  render() {
    const config = JSON.stringify(this.props.config, (key: string, value: object) => {
      //create string of json but if it detects function it uses toString()
      return typeof value === 'function' ? value.toString() : value;
    });

    const parsedConfig = JSON.parse(config);
    const concatHTML = `${this.state.init}${flattenObject(parsedConfig)}${this.state.end}`;
    let baseUrl = '';
    if (Platform.OS === 'android') {
      baseUrl = 'http://localhost';
    } else if (Platform.OS === 'ios') {
      baseUrl = 'web/';
    }

    return (
      <WebView
        style={globalStyles.chart}
        source={{ html: concatHTML, baseUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        automaticallyAdjustContentInsets={true}
        onMessage={this.props.onMessage}
        originWhitelist={this.props.originWhitelist}
      />
    );
  }
}

export default withErrorBoundary(MiniHighchart, Fallback, handleError);
