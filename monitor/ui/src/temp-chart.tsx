"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "./components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./components/ui/chart";
import { useQuery } from "@tanstack/react-query";

const chartConfig = {
  date: {
    label: "Date",
    color: "var(--chart-2)",
  },
  temperature: {
    label: "temperature",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineLabelCustom() {
  const { data } = useQuery({
    queryKey: ["chartData"],
    queryFn: async () => {
      const res = await fetch("http://rp5.local/api");

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return data;
    },
    refetchInterval: 5000,
  });

  console.log("data", data);

  if (!data?.temps?.length) return null;

  const chartData = data.temps.map((item: { timestamp: string; temp: number }) => {
    return {
      date: item.timestamp,
      temperature: item.temp,
      fill: "var(--color-chrome)",
    };
  });

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 0,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("sv-SE", {
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                });
              }}
            />
            <YAxis
              dataKey="temperature"
              tickLine={false}
              tickMargin={8}
              minTickGap={8}
              axisLine={false}
              domain={["dataMin - 20", "dataMax + 20"]}
              tickFormatter={(value) => `${value}°C`}
              scale="linear"
              ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="temperature"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleTimeString("sv-SE", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="temperature"
              type="natural"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-temperature)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="temperature"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
