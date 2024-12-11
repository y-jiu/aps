import { useState, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

interface GanttEvent {
  id: number;
  start_date: string;
  end_date: string;
  facility_name: string;
}

interface CreateGanttEventParams {
  bom_id: number;
  start_date: string;
  end_date: string;
  facility_name: string;
}

export const useGantt = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const getGanttData = useCallback(async (startDay: Date | null) => {
    if (!startDay) return;

    try {
      const formattedDate = dayjs(startDay).format('YYYY-MM-DD');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/gantt`, {
        params: {
          start_date: formattedDate,
        },
      });

      // Transform resources data
      const resourcesData = response.data.resources.map((resource: any) => ({
        id: resource.facility_name,
        title: resource.facility_name,
      }));

      // Transform events data
      const eventsData = response.data.events.map((event: any) => ({
        id: event.id,
        resourceId: event.facility_name,
        title: event.title || 'Event',
        start: event.start_date,
        end: event.end_date,
        extendedProps: {
          ...event,
        },
      }));

      setResources(resourcesData);
      setEvents(eventsData);

      return {
        resources: resourcesData,
        events: eventsData,
      };
    } catch (error) {
      console.error('Failed to fetch Gantt data:', error);
      throw error;
    }
  }, []);

  const updateGanttEvent = useCallback(async (eventData: GanttEvent) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/gantt/${eventData.id}`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update Gantt event:', error);
      throw error;
    }
  }, []);

  const createGanttEvent = useCallback(async (eventData: CreateGanttEventParams) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/gantt`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create Gantt event:', error);
      throw error;
    }
  }, []);

  return {
    resources,
    events,
    getGanttData,
    updateGanttEvent,
    createGanttEvent,
  };
};