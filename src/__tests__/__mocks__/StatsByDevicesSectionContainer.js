import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import { connectResources } from 'shared/utils/createResources';
import { bindAsyncActionCreatorToPromise } from 'shared/utils/bindAsyncActionCreatorToPromise';
import reportsRes from 'shared/resources/reports';
import StatsByDevicesSection from '../components/StatsByDevicesSection';

const StatsByDevicesSectionContainer = ({
  campaign,
  statsByDevices,
  getReport,
  intl,
}) => {
  const doughnutChartRef = useRef(null);
  const canvasRef = useRef(null);

  const initialAction = campaign.channel !== 'vk' ? 'read' : 'click';
  const [action, setAction] = useState(initialAction);
  const [dataByDevices, setDataByDevices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataIsEmpty, setDataIsEmpty] = useState(true);

  const devicesNames = {
    mobile: 'Мобильное устройство',
    desktop: 'Настольный компьютер',
  };

  useEffect(() => {
    if (statsByDevices.data) {
      const data = statsByDevices.data.dataByDevices;

      setDataIsEmpty(
        !data.total || (!data.mobile.totalCount && !data.desktop.totalCount),
      );
      setDataByDevices(data);
    }
  }, [statsByDevices.data]);

  const roundToTwo = (num, style = {}) =>
    intl.formatNumber(num, { maximumFractionDigits: 2, ...style });

  const getData = () => {
    if (dataIsEmpty) {
      return {
        datasets: [
          {
            data: [1],
            backgroundColor: ['#e7e9ea'],
            borderWidth: 0,
          },
        ],
        labels: [],
      };
    }

    return {
      datasets: [
        {
          data: [
            dataByDevices.mobile.totalCount / dataByDevices.total,
            dataByDevices.desktop.totalCount / dataByDevices.total,
          ],
          backgroundColor: ['#F26D4E', '#54C0EE'],
          borderWidth: 0,
        },
      ],
      labels: ['mobile', 'desktop'],
    };
  };

  const renderChart = () => {
    const chartData = getData();

    if (doughnutChartRef.current !== null) {
      doughnutChartRef.current.destroy();
    }

    doughnutChartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        cutoutPercentage: 40,
        tooltips: {
          enabled: !dataIsEmpty,
          bodySpacing: 10,
          xPadding: 15,
          yPadding: 15,
          titleFontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen"',
          titleFontSize: 14,
          titleFontStyle: 'normal',
          titleFontColor: '#000',
          titleMarginBottom: 10,
          backgroundColor: '#fff',
          borderColor: 'rgba(13, 13, 13, 0.1)',
          borderWidth: 1,
          bodyFontSize: 14,
          bodyFontColor: '#000',
          bodyFontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen"',
          callbacks: {
            label(tooltipItem, data) {
              const device = data.labels[tooltipItem.index];
              const label = data.datasets[0].data[tooltipItem.index];
              // eslint-disable-next-line prefer-destructuring
              const totalCount = dataByDevices[device].totalCount;

              return `${devicesNames[device]}  ${roundToTwo(label, {
                style: 'percent',
              })} (${roundToTwo(totalCount)})`;
            },
          },
        },
      },
    });
  };

  const setNewDataByDates = async () => {
    setLoading(true);
    const res = await getReport(`stats-by-devices_${campaign.unprefixedId}`, {
      id: campaign.unprefixedId,
      action,
    });

    setDataIsEmpty(
      !res.dataByDevices.total ||
        (!res.dataByDevices.mobile.totalCount &&
          !res.dataByDevices.desktop.totalCount),
    );
    setDataByDevices(res.dataByDevices);
  };

  useEffect(() => {
    if (dataByDevices) {
      setNewDataByDates();
    }
  }, [action]);

  useEffect(() => {
    if (dataByDevices) {
      setLoading(false);

      renderChart();
    }
  }, [dataByDevices]);

  const onActionChange = (data) => setAction(data);

  return (
    <StatsByDevicesSection
      loading={loading}
      canvasRef={canvasRef}
      campaign={campaign}
      dataByDevices={dataByDevices}
      action={action}
      onActionChange={onActionChange}
      dataIsEmpty={dataIsEmpty}
      channel={campaign.channel}
    />
  );
};

StatsByDevicesSectionContainer.propTypes = {
  campaign: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    channel: PropTypes.string,
  }).isRequired,
  statsByDevices: PropTypes.shape({
    error: PropTypes.object,
    fulfilled: PropTypes.bool.isRequired,
    data: PropTypes.data,
  }),
};

const mapDispatchToProps = (dispatch) => ({
  getReport: bindAsyncActionCreatorToPromise(reportsRes.getReport, dispatch),
});

const resources = {
  statsByDevices: {
    resolve: ({ campaign: { unprefixedId, channel } }) => {
      const initialAction =
        channel !== 'vk' && channel !== 'sms' ? 'read' : 'click';

      return reportsRes.getReport(`stats-by-devices_${unprefixedId}`, {
        id: unprefixedId,
        action: initialAction,
      });
    },
  },
};

export default connectResources(
  { resources },
  null,
  mapDispatchToProps,
)(StatsByDevicesSectionContainer);
