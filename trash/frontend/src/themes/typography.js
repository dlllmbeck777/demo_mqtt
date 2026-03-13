/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */

export default function themeTypography(theme) {
    return {
        fontFamily: theme?.customization?.fontFamily,
        h6: {
            fontWeight: 500,
            color: "#495057",
            fontSize: '13px'
        },
        h5: {
            fontSize: '14px',
            color: "#495057",
            fontWeight: 400,
        },
        h4: {
            fontSize: '15px',
            color: "#495057",
            fontWeight: 400
        },
        h3: {
            fontSize: '16px',
            color: "#495057",
            fontWeight: 600
        },
        h2: {
            fontSize: '1.5rem',
            color: "#495057",
            fontWeight: 700
        },
        h1: {
            fontSize: '2.125rem',
            color: "#495057",
            fontWeight: 700
        },
        subtitle1: {
            fontSize: '14px',
            fontWeight: 400,
            color: "#495057"
        },
        subtitle2: {
            fontSize: '14px',
            fontWeight: 400,
            color: "#495057"
        },
        caption: {
            fontSize: '0.75rem',
            color: "#495057",
            fontWeight: 400,
            padding: 0
        },
        body1: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '1.334em',
            color: "#495057"
        },
        body2: {
            letterSpacing: '0em',
            fontWeight: 400,
            lineHeight: '1.5em',
            color: "495057"
        },
        button: {
            textTransform: 'capitalize',

        },
        customInput: {
            marginTop: 1,
            marginBottom: 1,
            '& > label': {
                top: 23,
                left: 0,
                color: theme.grey500,
                '&[data-shrink="false"]': {
                    top: 5
                }
            },
            '& > div > input': {
                padding: '30.5px 14px 11.5px !important'
            },
            '& legend': {
                display: 'none'
            },
            '& fieldset': {
                top: 0
            }
        },
        mainContent: {

        },
        menuCaption: {
            fontSize: '12px',
            fontWeight: 700,
            color: "#B9B9C3",
            padding: '6px',
            textTransform: 'uppercase',

        },
        subMenuCaption: {
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: "#495057",
            textTransform: 'capitalize'
        },
        commonAvatar: {
            cursor: 'pointer',
            borderRadius: '8px'
        },
        smallAvatar: {
            width: '22px',
            height: '22px',
            fontSize: '1rem'
        },
        mediumAvatar: {
            width: '34px',
            height: '34px',
            fontSize: '1.2rem'
        },
        largeAvatar: {
            width: '44px',
            height: '44px',
            fontSize: '1.5rem'
        }
    };
}
