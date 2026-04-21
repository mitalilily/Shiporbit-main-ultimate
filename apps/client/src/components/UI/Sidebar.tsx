import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export const COLLAPSED_WIDTH = 74
export const EXPANDED_WIDTH = 184

const SHIPORBIT_LOGO = '/logo/shiporbit-logo.jpeg'
const SHIPORBIT_FAVICON = '/logo/shiporbit-mark.svg'
const TOGGLE_ARROW =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAkCAYAAAAU/hMoAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP9SURBVHgB3VhLThtBEO0Z4/CxSQCBEBISLFixQuICPoJZkK19BHMCQDkAQjkAzpoFixwA5wRwA9sLNmxMhFjwndTrVDU145lxTwROlJJK09Pd0/X6VVV/xpgceXh4aD0/Pw9Io3fU7tPTU938iRDA5svLSzQOAdjHx8daFpYwsyEMG0EQmHEI2TKENZPNLJABPhynkL1PmW3m35JU18VAEuUBq6F4NEXk+PjY7O3txepubm7Mzs6ObRslZM/azQI6BHJ3d7dEgdzxDfyTkxOMHq2vr8fqm82mrcdzlFCitmGXQQaZALkR7HqD7Ha70dzcnAVzdnaWChx9fECy7TALaJAAOUFrlxfIra0tC6bVasWAAxzq2+22zzACsiQgo9+uj7N4cHBgG5nykg9I+ibVzWnAi4IcYjLiWOSGUq1WG8kk2MKnUO3OLOCj5P7+/hvsMtB0kMrl6DSRF5ODwcC5c39/fyRwX5CwC/vwaqTcbZcg2lnQzxweHlr029vb3lvN/Py8K/d6PfukRLLLT1EhJg2FmyGQwDTMJMekzWzjkTjn5+eWMWT2xcWFqz86OnLuBuNFmBR3R6+hFwfJlTZxfGIyDxB9XzhxtLtNWnaz2OWHsxsx+cNn8DRAeu0E428GMmKXM+Xe62QWIFnM0eaTRAyybLKyO+FydCr7goRot2sBu6iv1+sjx8gDOSGuRjIRk0Gn0wlub29NESEwpt/vm7W1tVg9LU/m8vLSNBoNU0QIs8k6y7rDhSng7reSlJh0KGNHNdB5enrqZvM3BOskY3F1IQMK+OmQ0fnupxmjkGlrDyQlCXI7DuIRgplgxyH6v4+LTRywr66uvsp7bjwateOQTt7d3X2h00n/Pa+0FPu96+vrz7BH5GQvQYoxWczR+QPpFOnM8vJyhZ5V0llWW15YWPiI8uLi4qx6WpU6VdZaXVpaqq6srMxgfNjZ3Nz8gDUa9uXYmEonGtNAklZYxXA1Acq9CziAUBOratD8rGDyq6ur02CR7emjWqY4d2NmGxsb+HhasWkHVgC0VhTjThN9pb2iWHQgebcLo7QDhmZSAQWbk7SLTAlQNqKZ1cZmZDKi0l/K6Mv9NYtTIEPFo1wfUkHqOw60DDYxQwDlAaf1E8pGY226Xd4TzIlOsrcEYD7I6PXOG6gPJDbtYKKKYV1276zJ95jyOBi7DBblbpWbNAzUsSnbI5RdYQGjrN/FkLSpeik7jyS+kUSxqsB53QrkL0Zs3RTQ8kSQy7HOvGblhLRJXaLPUH+VB8VAalVgQx6wpFXXiUFVF+pkTJbV2EFeRo9CHWuXRT/nl2AkAZ9yj3J1iXLEl6632YOTs1Xvwro0aS/Eyolv/h/5BegDSXqKhZJ7AAAAAElFTkSuQmCC'

type MenuItem = {
  href: string
  label: string
  inactiveIcon: string
  activeIcon: string
  matchPath?: string
  compactIconClassName?: string
}

const upperItems: MenuItem[] = [
  {
    href: '/dashboard',
    matchPath: '/dashboard',
    label: 'Dashboard',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE4SURBVHgB7dc/boMwFAbwZygDYgBWphyhN+kVusPSFS7RG/QK3CBn6A0ysQLin4SQXD8pLJVq0yRgRfp+EpIV7M88hphHBABgk9DdrOv65Hnelxq+CiEiMivnef6I4/hyRJ4Wb9b3fV0UhYyiSKqftBfPybJMDsNQ89q984zUwjJNU+NGvy9+QPWg573zVkJTgEyShNq25TFtEQQBhWFIVVU1ahzvmWfEG9L1LVzHd81/dN7KoSeHAmxDAbahANteNPcadYhEfPCwLf/djA+eg/L0xnE853n+76OfPxe6riv3zjOapunEH1IcoN6CcSOeww/Ia3jt3nkrYSpiWZZPx3HeyKyRUn67rvvu+/7liDwAQE+MnvjmvBV64q3z0RP/AQXYhgJsQwG2oScm9MS35a3QEwMA3OUHA1ChJcvDW10AAAAASUVORK5CYII=',
    activeIcon:
      'https://seller.parcelx.in/static/media/DashboardHover.9ea3985454ae5ded65117e31b58c079c.svg',
  },
  {
    href: '/addorders/forward/AddOrder',
    matchPath: '/orders/create',
    label: 'Add Orders',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE9SURBVHgB7ZiNjcIwDIWfTjfAjZDb4EboCNwGHeFGYINjA8oksAFigpYJGAEcyVECUoWhjlGFP+kpUtvYdf4dwHEcx3HelIa0JvWkM+tPUK/8fs82FjAkkLbFT5RaCer3I3V7tl2VH9KJHcZyOdFptNciB3XiZ1UIyD/fkb6gR7S1Qg4ioAKplSTD5Fk69rGFMgvkcarZ8rdE26mXGyjSsdEW9VmyrzUU2bPRahOsICD3thppqbNC7O8DM+dT+N0AWwY4juNY0EN5w7Jm8gY5+41MGkA83qoerqypdRbyISQN4MhlwHOMJfKJsST/LtIAdly2mCkNcsKtmVKa5hnpLkhzNTINICAn3P/Q6QnrTO/qYitOshbT8mTzACIB46uK5G605CX7wED6Jv2SNqRD8S7gMQZ4+ug4juO8MxdDRXCkh3GwEAAAAABJRU5ErkJggg==',
    activeIcon:
      'https://seller.parcelx.in/static/media/AddOrdersHover.7671c0c8fa6d7da0bd7fb729f652350a.svg',
  },
  {
    href: '/shipment',
    matchPath: '/orders/list',
    label: 'Shipments',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHCSURBVHgB7ZiBTcMwEEU/iAG6AccGMAFhkpYJ6AaUCVomoEzACM0mNROUDcAn20oUQXLnxA4IP+mUSr04vvsXnx2gUCgUCv+ZM8SxsLaydmvtGuMw1l6t1f53csja0drnxHb0Y6uIUSA8yFh7gstcny9z1ePDCm5bY95Y+0Ai1miytRD4h+xKOHjfDRJBaEqnEt6jCaDyvifIkqPm0T+gVtyjCYBJpgJBn31AH0CFRCps/cAv0KENgJlcBWpNhKAjJoAKChUuMMzGX3lp0yoQOEAPT36NCZQwmL5paZpbLxIFAvfI1Orhsv8mcdQEUCNfACR1PMcfpwQQAcEtkWtMQO4A+OU8+CshEwZxTew79pAtjyT0y6oAl8wSriHeISMG4xUgNM1ppfDPpgDXdNXzX9hKPMOVUVYMhhXYeR/etXY3YHsIs9mCIu75EYPhAFZwS2P3cB6OoCfoSpCQOYDw0COaCW+gq/vuWNkDYLh8QjkF20EPYaYAAlw6pxETIMwcALNA/LmWkOA8oCXZx6k2v3U3KlZOogDLeGntAe4jbI7MLv31HRNQYb4zMQ1NTvpxl+A6KiEPBq6P1CgUCoVCoYcvKTTYKUVqLwgAAAAASUVORK5CYII=',
    activeIcon:
      'https://seller.parcelx.in/static/media/Shipments%20Hover.5192eb45cd675e0700702234d0e0aa59.svg',
  },
  {
    href: '/channel/pending',
    matchPath: '/channels',
    label: 'Channel Orders',
    inactiveIcon:
      'https://seller.parcelx.in/static/media/channel-order.43228d842a59633eaebdfce8157056cc.svg',
    activeIcon:
      'https://seller.parcelx.in/static/media/channel-hover.aea9aca48dc772926b4d4f970ddd48c2.svg',
  },
  {
    href: '/wallet/wallet_deduction',
    matchPath: '/billing/wallet_transactions',
    label: 'Wallet',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF8SURBVHgB7ZiBTcMwEEU/iAE6QpiAbFCPwAaECegGZAPCBC0TABOQDSgTNEwAG8Cd7KhRCI1jgy+Ce9KXU9WJ/p19tmVAURRF+c8cIT05yZDOSAvSI+mB9I6ZkpEK0pr0RvoY0M71mwWc1XNSBWusb7YhbWCDKjp9dhCCDRvSNekJXw1z1nmKrDCcZX6/DcIgEbkzxIb704J/16RygqHKvVtiIiee/dppsXTtovf/C6xpzvQW0wsyuIB9ViHO9j2+L7IQw30yp8aJE1K55+gPDxViKl2MGRwbAc7ClXu+hZ0mKdbrAnvzp4gYCS5SzsQa6WkLuzrU6Rh+3CE9tWvzQ518A5DAa6rOOQAvNABpNIBIeIXJEIFkADekZ9idfoVAJAPomjYIRDKAuvO8RSC+x+nf4BL2aM4b1gaBSAbQYOSc44Muo9JoANL8+QBeXWuQnqVroy68DPZ3PQXS0F7htPdNBpGUkLuVKPFDFLDbfSrjNdKNuKIoiqLI8Qkl0K0+Lyp57gAAAABJRU5ErkJggg==',
    activeIcon:
      'https://seller.parcelx.in/static/media/Wallet%20Hover.afc8b43dd349d96944ac6e8f70c9a17e.svg',
  },
  {
    href: '/ndr/ndr-shipment',
    matchPath: '/ops/ndr',
    label: 'NDR',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGVSURBVHgB7VTLbcJAEF0bC8GNCxKfCx3gVBDogA5wB1E6gAoMFYRUEFJBSAVxKsAXfyRffLQtf/LGsSV7ZSc2UsiFJ61mP6OZ2bdvlrEb/hvCbw4DoNfrDVgD2Latt04wmUzOSZJ8OwtCmghrl1/THFazLGvJmmI0Gs0oQb4ej8eH6XSqVK153xwi+2NIrD3WqPQ+m5M9sUsT4HHdIAhO+Rocb6IoWhRc3j3PO7JroO4NKm9ADxfH8RrTGYaOoYVh+Ow4jsZaQuKrgNyeEJzo2GbBaW8lSdILKiQ57g3DOPCBiE7f938uALJ7Q5BN3TkKUOBzxlBZQ5QajbrWBXgnUCbjsRlRRLfsdDofeOw7jAHmMm41ZxmdaLTH2gR1QMUrGBWB8q1ZZokSDXR+psEEQTVNs1HMStBNiCayxf1cQVX0lrINh0MZV+Y/Nr3qEyskJbXtIIwt6Nnx5yUVdbtdkuec86HqSFVHjFc0VqqUfr+/gHkgxYmiuETwSgU14osoQSAF0zl4TumhnxNmj8DX6eQbLsYX2qOqc9sGJQAAAAAASUVORK5CYII=',
    activeIcon:
      'https://seller.parcelx.in/static/media/NDR%20Hover.c3d3348247504dd7c3de905fb68b607b.svg',
    compactIconClassName: 'compact-ndr-icon',
  },
  {
    href: '/report/mis-report',
    matchPath: '/reports',
    label: 'Reports',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHISURBVHgB7ZixagJBEIbnjhPbnIpgobn0Ftfb6ANYpLRK8gRJbZPLE8Q3iJWWIY1tsLCOeQPRQhAULcXCzCzZcJg72IOVIWQ+WHedGdf9YW9mbwEEQRAEQeDDASaWy2WQz+dfcNg8cc32+32rUqnMTOZxgYlcLhfB78UTJOwVDPGACdd1L6mfTCYwHA6VrdFoQKfToWFoOg+bAM18PofBYKDGx+NRCzCGbQvZQgRwIwK4OUsWWq/Xj9gFcRtmmHGpVOqDZawLwMU/O47zcGpH2y36gmKxGIFFrAvAhTapp/y+WCyUrVqtQq1WI98Nfo3AItafAdwqPvVUXdvttmq60p4DyULciABu/lchW61WIZ7j42f17eFwmJq+PZ0DYwFUXTGPR6d2fHvaorBWuVyeAgPGW4gqaYrrwvO8CJjI8gwE9NHtdiEMQ9VGo5H2XQATmY8Su91OHRP0mBtJo9xk3kJ09aGhU2Ya9Xr954aBxmnQHDouPrcpxjdzm83mA1LuazBD9X3fv/uOe4fkCytiXCgUlA/Tcg9/d58SN8O4KzAgSxq9pokTXGNsT7E4EvKZFBdPxVgQe9i9JfzPFFsLBEEQBEH4A3wBOCd1DSqJYlUAAAAASUVORK5ErkJggg==',
    activeIcon:
      'https://seller.parcelx.in/static/media/Reports%20Hover.0972b845e2f20b245d5dc7bf1557d37b.svg',
  },
  {
    href: '/billing/cod',
    matchPath: '/cod',
    label: 'Billing',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP+SURBVHgB7Vk9SCNREJ47Dn8QNIIKFnp7YqmQ0l/IWfnTREQQEVQQCxstBO00iKAWGlAULEysLEQUFFELN42FiFxQUKx2T0HxNxEEfwpz8wVX9sLl1PVlw5354LH7Mi9vZnbfvvfNDFEMMXxsfHrtwPPzc9v29rZ9f38/JTEx0RIfH28hwfD7/WpOTs7PoqIiT3p6uodE4OTkRHK5XHJJSUmAu6a0/Pz8wMjIiAu6X7Lv00vG9/T0yJOTkxL6ycnJxI5QSkoKRQKHh4fBdnR0FOy3traqDofje2ZmpkpG0NXVJdPTU+F7xefz2blJFCFg7ouLiybo0vTi7ZMR8ET27OxsvfESmQTo0pyADfj+6K0YHh52Y4KsrKwAT2gjkwGji4uLA5WVlYGZmRlXuHGfwwlOT0+/4lpVVUWpqakeMhnYhXJzc/3Ly8t0cHBgDTcurANXV1ffcH18fFQpSoiLi7vG9fj4OOyW/Zn+ccQciDZMdeDs7Mw6Nzc3jy2aBME0B3Cq9/f3yzU1NfbR0VEXCcIXMgE6SmIBHSksLJwmQYj4G4DxTqfzmU+Nj497y8vLO0gQhDmgKIrlT0f++vr6/ODgoIR7pgcqH4zVJBDCHFhaWpLLysrkxcXFZ/Ily7Krra0teIqCWXZ3d3/nU10lgRD2DVxeXtLu7i41NDTYYPjNzY3a2NjYdH19Te3t7f7e3l7hxgPCHOAn3czLSJ6enrbAcPwGbl9XV0eRMh4Q5kBGRoaXv4FqbjIIGJCXl0djY2PNbLyXIgSh2ygY5MbGRjM/+eA+z/u+Iy0tzU0RhPBzgDm8m+MHFfdm0PCIHGRmxg8xMhdtGF5CYJQgZXd3d+9NcKmdnZ3NRhNZhh1YW1uzc85GRHZOslqtjXz1kAEYdqCioqJ3aGgIeRx6D5KSkvxM7hxkEIYdeDpZbSQATLXJKGK7ULQRcyDa+FgOvKbg8B4gLH2rjhcduL+/tyBnz1GVr6WlReFgxcdhY0+o4q2trQ5kkfv6+pwYHzoPTm7IUXlhyt0Uaij+z4GPUltbqwwMDCiY4+HhwXglZWJiYoGeigxanUDfhxMwAoE8cvlctflNzjTjB+RIZqFIoZejcYys4L9wfnV1dSRUh348nKa3AkUGKNEmQZ2AT14PR1nPRnKGIaCvnUGGnL7Wh+wleX19/bOxkOHBQRf6nEN6X3EFf8TrXllZcWpFDrxaLCP904LCqakpD8ZjHBzXjAgxxMbNisyFXo6GObWlh1IWdGJZ8f1f+dary6yhjm1ubnZw3t6akJCgMi9aYGqxoJNb9vb27Ds7O/bb21t/aWmpl4sVbh7j18bA2NnZ2WCOtKCgwCtJkjtSgX8MMfzP+AW682TbZ6zW7wAAAABJRU5ErkJggg==',
    activeIcon:
      'https://seller.parcelx.in/static/media/Billings%20Hover.df75f4a30048720eb2957ab078d68d7d.svg',
  },
  {
    href: '/custom-tracking',
    matchPath: '/tools/order_tracking',
    label: 'Custom Tracking',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFYSURBVHgB7dlNaoNAFADgZ52VoOARegHpBaQeoTfoKVzoJulGFx6iHqFHsOoBiifoGRRcKdN5IS1W4mAwYSbhfSBOMg68+clDXgAIIYRsYCx1dF0XiFsAGuCcfzmO87F6QF3X777vcxyrw+V5HseYYI22bV9wgMqAT124oMdT8Q+bf2EYxlPTNId23/fFOI6fsCBN012SJBDHMURR9AZXYJrms2VZQVVV+DEQVzHtZ7LBGLxt2/ulfhH47rcte24Lsep7kPwWH+DGSXcAt++4AgfDMOSu636DRqQTwLMHk+3LsuxV3B5BI/d9hOZZiDGWh2EIOtmUhXRAWUg1ykKqURZSjbKQapSFVKMspNrNHyGagGo0AdVoAqqd9S40J0qLf23Zc1tgDGcNwAKqTpVpmFSosfAMa5RlmetUocYFFeX1/FSsi39w4GyxUg16KMQrTQGEEEIu7QcyJzC0YDqNcQAAAABJRU5ErkJggg==',
    activeIcon:
      'https://seller.parcelx.in/static/media/Custom%20Tracking%20Hover.c73558000f9b5a3b9d9dd51e44455506.svg',
  },
  {
    href: '/communication/credit_recharge',
    matchPath: '/settings/api-integration',
    label: 'Communication',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFGSURBVHgB7dntTcMwEAbgF8QAbEBH6AbcCIwAG8AE7QbpBmQFJmhGYIOGCegGcKa2HEVUrd27Xj/ukU6pqijWGzt/7gDnrtsNDkNcU6571FlzfXJ1ODLiWnL9CNUqPrNYzQ68cjXxd3iDH1w96ky4HuM1eONaQBEhv7WwUO3RGZsPnktQtIqLzCFvEZ+9hBJCPq8awm5+o3AXbrG/abx20JG+p+FaO5UESOf9C3r60Vo7lQQ4SR7Amgew5gGseQBrHsCaB7DmAax5AGsewJoHsHb2Ae6g4xm535n0XC2EaQV43/J/C2FaAV7w/w6IKwmwjteHPe5tUWcyWksUYdN4DQ1Yqbb6WOp+E5SkqUwDeTPodr//EPIgYgYZYTcbVA44Dh0x9di022s71uF7ekI+kuojpoSQz6tEdTjikG+IcKZjVucuxS9O7WGjGCTQrAAAAABJRU5ErkJggg==',
    activeIcon:
      'https://seller.parcelx.in/static/media/Communication%20Hover.44712b1c484cca17ef0b184c0efc4e74.svg',
  },
  {
    href: '/tickets',
    matchPath: '/support/tickets',
    label: 'Tickets',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFUSURBVHgB7ZbhbcIwEIVfKwbIBrkNygZ1N+gGZIO2E5ANygYdId2AblB1gqQTABOArdiKA+cEOcaA5E96Mj8u3Mv5zg6QSCQScSGptdQ+kmqpV5eZr4hGjDYm+QynlVF8SH2DR2jTjdQL/CG0u5BJ5VL/M0fgVifjaBy/J/OIG8Jl5hndll0CtTXFWFCFfnMtmRiBbhJ8WKBtWjtPxgWSVIn+eC8DmhHoT9EKZ1QI2hTnXEwwU+tnKziqMYSp0HsAM3N0L0dcwNg0/en1CdMhvf7AcSSMmcn1ukM45vCA0JXVvj8E/LZJ9YiZosW5D5FOXjuSCvg3cIn+lA5W6ROntyoFNKOomBwsZnpUOUvw4ycwzYyikPq1DOUYMFMM/JEIYEZBx2bu4qK8CsffM1u9vsE9fpm1ruGP3Y/sOaaO/X1krUzyB8YQoW3SGDRor4dE4v45ACc5teRehvq0AAAAAElFTkSuQmCC',
    activeIcon:
      'https://seller.parcelx.in/static/media/Tickets%20Hover.bb343b5bdafa797ccc46736bdc031707.svg',
  },
]

const lowerItems: MenuItem[] = [
  {
    href: '/utility/ratecalculator',
    matchPath: '/tools/rate_calculator',
    label: 'Utilities',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHCSURBVHgB7ZmBccIwDEV/ex2gG8AIbFB3g24A3YBOQDoBbADdgE5AukE7AWGCsgGVLvIlDUeCYzmhxe/uX7gztqxIsRIbiESumxu4Y0gj0j102JM+SSkCY0gb0iGQtmLDiXMjMCXN5TffsXdSBh2GpAe5Mi+kBRQxKO4SD6yVOlWSkh0DRbYyaILwLMTWBkoYFPnZBRzdbzhE4bahfSTXFN1gn6+y7VruGtptvu9q/mPgnrO8bK5PtGUV27U0OdDEkjRBO1akZ3ji48AT8slnpDe4MZa+3C+FBz4O2BzlSSRwZ4Y89VJ40PQQXzzRgb7xcWAv1wHcGVbGaI2PAyuZwATub55j6buGJ74ReCR9wZ0P6ZvBE99CxhX1rJIfirgK9c1VO8ArCb+7b+W3Rps6CU5/jdkvtYNMSKOtyeYRPhEov6/vldqc8XGAdw8ymcSrUps6Cbr7oG9lMy6jfRPrAGIdcLJ5RKwDuPA6wNvqHM4lumMlNqdQwKDI1VDb6lXsM2KgxEYGnCM8MwTYDTcoVo0ZwsDRnaPFAUebI6YM+XbgDjoMkO+z2hRVP2KyGPxew7WVIuAhX9WRP3nMGon8R34AGFrQ8Luu1gcAAAAASUVORK5CYII=',
    activeIcon:
      'https://seller.parcelx.in/static/media/Utilities%20Hover.8c3c2935d1e9e7751f69fd116ee83506.svg',
  },
  {
    href: '/support',
    matchPath: '/support',
    label: 'Help & Support',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIWSURBVHgB7ZiPUcIwFMY/PQdgA7uBdQLrBOIE1g1gAuoEsAHdAJ2g3QA3sE4AG2jeNT1Cmte0mNLi5Xf3HVySJl/+vBcK4PF4PB7PAFzBPaFUxV6oEPrECImEMqGd0A8jqtsITTECIqEv8GY50TMxBmAitAS/srlQKpWD34ml7OtsprcGsyuUO8BB5z5F3fwWZzBvMp0LBUqbSGgmtJZKcDwharvBmc3rxyNR6shsdSRM557KForBBPVj0wsxzKYDlBlFNRiAP9dVvcl8hB5QVzHHwbS+umtZN0NzaqxyvTrpDI6JtIED1Cej1xEJmlPiRLbvbdVT1Fd0YTCzMjybgDefyDaZoX8nqCs7NZSpK2gigHl3dvKZSCtzQqgNpg+kB1wTMcr4UJ+dyT6543YykWaQSNDdtEo1+RiHHSxQ31WWG9gJlO/fysDEu9Aryl+AXaD2uVZGR+RW65/lGnbuDGWF0KPQsxwkkwO/NPQzlW24WFAn/4A/skD9ejcZaqqvUDNHbKm33qS2FY9hh14QCvk9b2j3IT/3lnZdxmbR01fOtKsuEhsh+PObGcZjaROcbdijXYA6e31rE5yj5N8azzEcRVOlzfgc3S8XV8ybKm3BScF0jzI1BbCsgkPeUN7KF4HtgjrCVTrUoV98T+hGiBGQgn95aKPANsAY0yEFZWFr1MefnkSE014GKCCHymIej8dzifwCOWEVnXPT1JEAAAAASUVORK5CYII=',
    activeIcon:
      'https://seller.parcelx.in/static/media/Help%20%26%20Support%20Hover.75bf196513c2becbe1d614f2e9e4db0a.svg',
  },
  {
    href: '/setting/labelsetting',
    matchPath: '/settings',
    label: 'Settings',
    inactiveIcon:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAwCAYAAABuZUjcAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASbSURBVHgB7Vg9SyRNEC4/Yj/wKxBlwVRlAzMNFgMDTS5UI99II98FQTNXAw1dAwUNdAUTFfF9Q1FxXRBFEe5QQTFwFgwEP9jzB+hcPcPUXt/czOzc7nh43DzQzDDdVVNdXVX9dBMFCBAgQIA/GUXkEx4fH6PJZPLf29tb2/7W1tavbW1t/9TW1n6hj4TFxUWNH7pbu7m5SZJPKCUfwN6ODA8Ph/De3NxMLS0tP/QfHh7S3d0dbW5uRjKZTEVlZeVX+gh4enpaaWxsNLy6s7OjsXERtW1tbWXQ197erj8/P0fpd4MN/IQfw8OaplXg2/39fUjCpKGhwdawi4uL2fLycmNip6ennyGD79AhOvk5QO8BKB4aGtI5DPSenh59enpa39jY0GKxWEa8PTc3p7OHQ1ZZTHRsbMwYg7HxeDyDyUIHdOEb+jGO/AQ8AyPJJfF6e3vh7QknHZeXlysc/67Ji9UgP8EGxcSro6Oj+urqqg7vI2b7+vr05eXljJfY5TGzWBXIdXd3GzpmZmYyeJLfOYB4nJ+fNxSbMTyB7xwSYW6fzFbhVR9CyZQZkLBCmZQcQCL/ij5H7O/vZyvGwsKCZhfDVjw8PISRE0g8vOcaD53j4+NG5cG/zs/P41QIkCyyjAiJXJmPfuQCZDo6OoyG97OzMw2TcJPFSkoOIFG9TNhN2QqZiYO4ljLmMDYmk7RrMAZjnORhKKoMmV53S/SckBIIZYhBeM4u/tRxZWVlRgJzuUsjXrFSqvF2JQ8OwcYlcQ555BAVAswcFYBMT1xfX/9nHSOlEslrTi4ifXhXS+nx8XHSKn90dJRUq5ZvlUWtwfCamqDwoHjVbQOSMW7ycJDXECn2Mqi+vj46MjJiECPevun19TUifUVFRSGemPHOXksxgUpb5Wtqag66urqy8oxQ1oDi4rDIc7ilqqqqJsgvw1U29/LygoctuystLS2nPGDqpLq6Os/yngxnj8SZkxhJyctKJSUl2cOArutpUFkglUqF7SoPSiEnnyFvUt609L29vX3hEDHeJycnw26V55cARZKcSL6rq6uEdYzQVqk8qvGIYVQMMpPz5OTkJz6C5JSKgupUsPEoc8LqlIpRYTO5qCQYDMDPUUnAAEWevpe5iFUeybq3t5cth5ApiOaqGxCIlNt2j2rgtgGZZW7CSV7dgND4XwnKF+qW74W5wUvr6+uaMEdhgDzpAztPq1AZKFYPRIwKQT7MzTyyDZgt5w5oZaB8W5C/txUjbJmbMED1GOcFclxTmaPKQJ02sbyA2MTSk5n1OHoJA8TRC97yUgkwBrL9/f1Z5phIJLJ8RuX7vgDhISXPqZk54Gg89gKcV910mHy/8EOECmGA8Ao8NDU1ZTBAeBDfyIVHq0mOsThgc7lMQwcSGDxocHBQf9eTPiqLelxDPMpqOPFo3LtIgqPqSAxDBxIZMu9mtBvwYzGMYzYJD6vNcu8ySz7Alys45hsHHD4xjlFaWlqK7O7uRtR+kxESJyTY4Ap9JKytraUpx6UnwoR8gm/XzIjR7e3tKF9u2laFpqYm6uzsjFZXV/9PAQIECBDgr8c3i81bJm+YcmgAAAAASUVORK5CYII=',
    activeIcon:
      'https://seller.parcelx.in/static/media/Settings%20Hover.874f8f946228f7acf1da4ed85866bd75.svg',
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onHoverChange?: (hovered: boolean) => void
}

const routeAliases: Array<[string, string]> = [
  ['/dashboard', '/dashboard'],
  ['/orders/create', '/addorders/forward/AddOrder'],
  ['/orders/list', '/shipment'],
  ['/channels', '/channel/pending'],
  ['/billing/wallet_transactions', '/wallet/wallet_deduction'],
  ['/ops/ndr', '/ndr/ndr-shipment'],
  ['/reports', '/report/mis-report'],
  ['/billing/cod', '/billing/cod'],
  ['/tools/order_tracking', '/custom-tracking'],
  ['/settings/api-integration', '/communication/credit_recharge'],
  ['/support/tickets', '/tickets'],
  ['/tools/rate_calculator', '/utility/ratecalculator'],
  ['/support', '/support'],
  ['/settings', '/setting/labelsetting'],
]

const routePreloaders: Record<string, () => Promise<unknown>> = {
  '/dashboard': () => import('../../pages/dashboard/Dashboard'),
  '/addorders/forward/AddOrder': () => import('../orders/CreateOrderWrapper'),
  '/shipment': () => import('../../pages/orders/Orders'),
  '/channel/pending': () => import('../../pages/channels/ChannelOrders'),
  '/wallet/wallet_deduction': () => import('../../pages/billings/WalletTransactions'),
  '/ndr/ndr-shipment': () => import('../../pages/ops/NdrList'),
  '/report/mis-report': () => import('../../pages/reports/Reports'),
  '/billing/cod': () => import('../../pages/cod-remittance/CodRemittancesList'),
  '/custom-tracking': () => import('../../pages/tools/OrderTrackingForm'),
  '/communication/credit_recharge': () => import('../../pages/billings/WalletTransactions'),
  '/tickets': () => import('../../pages/support/SupportTicketsPage'),
  '/utility/ratecalculator': () =>
    import('../../pages/tools/RateCalculator').then((m) => ({ default: m.RateCalculator })),
  '/support': () => import('../../pages/policy/CompanyDetails'),
  '/setting/labelsetting': () => import('../../pages/settings/LegacySettingsSections'),
}

const preloadedRoutes = new Set<string>()

const isExactActive = (pathname: string, item: MenuItem) => {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true
  const alias = routeAliases.find(([source]) => pathname === source || pathname.startsWith(`${source}/`))
  return Boolean(alias && alias[1] === item.href)
}

const renderItem = (item: MenuItem, pathname: string) => {
  const active = isExactActive(pathname, item)
  const preloadRoute = () => {
    if (preloadedRoutes.has(item.href)) return
    const loader = routePreloaders[item.href]
    if (!loader) return
    preloadedRoutes.add(item.href)
    void loader().catch(() => {
      preloadedRoutes.delete(item.href)
    })
  }

  return (
    <li key={item.href} className={`NavLink ${active ? 'active-link' : ''} nav-item`}>
      <NavLink
        className={active ? 'active-link' : ''}
        to={item.href}
        onMouseEnter={preloadRoute}
        onFocus={preloadRoute}
      >
        <span className="iocns__00">
          <img
            src={item.inactiveIcon}
            alt=""
            className={`menu-icon inactive-icon ${active ? 'd-none' : ''} ${item.compactIconClassName || ''}`.trim()}
          />
          <img
            src={item.activeIcon}
            alt=""
            className={`menu-icon active-icon ${active ? '' : 'd-none'} ${item.compactIconClassName || ''}`.trim()}
          />
        </span>
        <span className="no__987">{item.label}</span>
      </NavLink>
    </li>
  )
}

export default function Sidebar({ collapsed, onToggle, onHoverChange }: SidebarProps) {
  const location = useLocation()
  const mainClassName = useMemo(
    () => `sidbar${collapsed ? ' parcelx-sidebar-collapsed' : ''}`,
    [collapsed],
  )

  return (
    <div
      className={mainClassName}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className="sidebar__menu">
        <div className="logo__cenetr">
          <NavLink className="navbar-brand" to="/dashboard">
            <img src={SHIPORBIT_LOGO} className="App-logo" alt="ShipOrbit logo" />
            <img src={SHIPORBIT_FAVICON} className="App-logo favicon-sidebar" alt="ShipOrbit mark" />
          </NavLink>
          <button type="button" onClick={onToggle} aria-label="Toggle sidebar">
            <img className="right-left-arrow" src={TOGGLE_ARROW} alt="" />
          </button>
        </div>
        <div className="side____bar">
          <ul className="nav">
            <div className="uppersidebars">{upperItems.map((item) => renderItem(item, location.pathname))}</div>
            <div className="lowersidebars">{lowerItems.map((item) => renderItem(item, location.pathname))}</div>
          </ul>
        </div>
      </div>
    </div>
  )
}
