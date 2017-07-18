import React from "react";
import Responsive from "react-responsive";

// Desktop, tablet and mobile setup
const Desktop = ({ children }) => <Responsive minWidth={992} children={children} />;
const Tablet = ({ children }) => <Responsive minWidth={768} maxWidth={992} children={children} />;
const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;

// Default (desktop, tablet) and mobile setup
// export const Desktop = ({ children }) => <Responsive minWidth={768} children={children} />;
// export const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;

interface IResponsiveFlags<T> {
    desktop?: T;
    tablet?: T;
    mobile?: T;
}

type ReactInstance<P> = JSX.Element;
type ComponentBuilder<P> = () => ReactInstance<P>;
type ComponentFromResponsiveFlags = (options: IResponsiveFlags<boolean>) => ReactInstance<any>;
type PropsBuilder<P> = () => P;
type ResponsiveComponentBuilder<P> = ({ base: ReactInstance<P> } & IResponsiveFlags<PropsBuilder<P>>);

export const ResponsiveWrapper = (props: { children: ComponentFromResponsiveFlags }) => {
    return <Desktop>
        {(desktop: boolean) =>
            <Tablet>
                {(tablet: boolean) =>
                    <Mobile>
                        {(mobile: boolean) => props.children({ desktop, tablet, mobile })}
                    </Mobile>}
            </Tablet>}
    </Desktop>;
};

export function responsive(options: ComponentFromResponsiveFlags): JSX.Element;
export function responsive<P>(options: ResponsiveComponentBuilder<P>): any;

export function responsive<P>(options: any) {
    if (typeof options === "function") {
        return <ResponsiveWrapper>{options as ComponentFromResponsiveFlags}</ResponsiveWrapper>;
    }

    {
        const builderOptions = options as ResponsiveComponentBuilder<P>;
        const BaseComponent = builderOptions.base;
        return (props) => <ResponsiveWrapper>{(flags) => {
            const responsiveProps =
                (flags.desktop && builderOptions.desktop && builderOptions.desktop()) ||
                (flags.tablet && builderOptions.tablet && builderOptions.tablet()) ||
                (flags.mobile && builderOptions.mobile && builderOptions.mobile());
            return React.cloneElement(BaseComponent, responsiveProps, props && props.children);
        }}</ResponsiveWrapper>;
    }
}
